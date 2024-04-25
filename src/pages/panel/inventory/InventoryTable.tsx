import { ButtonBase, Stack } from '@mui/material'
import { GridColDef, GridRow, GridRowProps, GridSortItem } from '@mui/x-data-grid-premium'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { GTMEventNames, panelUI, settingsStorageKeys } from 'src/shared/constants'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { AdvancedTableView } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import {
  PostWorkspaceInventorySearchTableResponse,
  WorkspaceInventorySearchTableColumn,
  WorkspaceInventorySearchTableRow,
  WorkspaceInventorySearchTableSort,
} from 'src/shared/types/server'
import { isAuthenticated as getIsAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { DownloadCSVButton } from './DownloadCSVButton'

interface InventoryTableProps {
  searchCrit: string
  history?: {
    after: string
    before: string
    change: string
  }
}

type RowType = WorkspaceInventorySearchTableRow['row'] & {
  INTERNAL_ID: string
}

type ColType = GridColDef & WorkspaceInventorySearchTableColumn

export const InventoryTable = ({ searchCrit, history }: InventoryTableProps) => {
  const { sorts } = useFixQueryParser()
  const [dataCount, setDataCount] = useState(-1)
  const navigate = useAbsoluteNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState(settingsStorageKeys.InventoryTable.rowsPerPage, 10)
  const { selectedWorkspace } = useUserProfile()
  const [rows, setRows] = useState<RowType[]>([])
  const [columns, setColumns] = useState<ColType[]>([])
  const [sorting, setSorting] = useState<WorkspaceInventorySearchTableSort[]>(
    sorts.length
      ? sorts.map((sort) => ({ direction: sort.order.toLowerCase() as 'asc' | 'desc', path: sort.path.toString() }))
      : [
          ...(history ? [{ direction: 'asc', path: '/changed_at' } as WorkspaceInventorySearchTableSort] : []),
          { direction: 'asc', path: '/reported.kind' },
          { direction: 'asc', path: '/reported.name' },
          { direction: 'asc', path: '/reported.id' },
        ],
  )
  const initializedRef = useRef(false)
  const { data: serverData, isLoading } = useQuery({
    queryKey: [
      'workspace-inventory-search-table',
      selectedWorkspace?.id,
      searchCrit,
      page * rowsPerPage,
      rowsPerPage,
      page === 0 || dataCount === -1,
      JSON.stringify(sorting),
      history ? JSON.stringify(history) : '',
    ],
    queryFn: postWorkspaceInventorySearchTableQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const [data, totalCount] = serverData ?? [[{ columns: [] }] as PostWorkspaceInventorySearchTableResponse, -1]

  useEffect(() => {
    if (totalCount !== dataCount && dataCount === -1) {
      setDataCount(totalCount)
    }
  }, [totalCount, dataCount])

  useEffect(() => {
    if (sorts.length) {
      setSorting(sorts.map((sort) => ({ direction: sort.order.toLowerCase() as 'asc' | 'desc', path: sort.path.toString() })))
    }
  }, [sorts])

  useEffect(() => {
    if (initializedRef.current) {
      setDataCount(-1)
      setPage(0)
    }
    initializedRef.current = true
    const authorized = getIsAuthenticated()
    const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
    sendToGTM({
      event: GTMEventNames.InventorySearch,
      authorized,
      q: searchCrit,
      workspaceId,
    })
  }, [searchCrit])

  useEffect(() => {
    if (!isLoading) {
      const [{ columns: newColumns }, ...newRows] = data ?? [{ columns: [] }]
      setColumns(
        newColumns.map((i) => ({
          ...i,
          field: i.name,
          headerName: i.display,
          flex: 1,
          type:
            i.kind === 'boolean' || i.kind === 'date'
              ? i.kind
              : i.kind === 'datetime'
                ? 'dateTime'
                : i.kind === 'double' || i.kind === 'float' || i.kind === 'int32' || i.kind === 'int64'
                  ? 'number'
                  : 'string',
          display: 'text',
          valueGetter:
            i.kind === 'date' || i.kind === 'datetime'
              ? (value) => new Date(value)
              : i.kind === 'boolean'
                ? (value) => (typeof value === 'boolean' ? value : value === 'true')
                : undefined,
          minWidth: 100,
        })),
      )
      setRows(newRows.map(({ row, id }, i) => ({ INTERNAL_ID: id + '_' + i, ...row })))
    }
  }, [data, isLoading])

  return isLoading && !rows.length && !columns.length ? (
    <LoadingSuspenseFallback />
  ) : columns.length ? (
    <AdvancedTableView
      loading={Boolean(isLoading && rows.length && columns.length)}
      autoHeight
      columns={columns}
      rows={rows}
      pageSizeOptions={panelUI.tableRowsPerPages}
      filterMode="server"
      sortingMode="server"
      rowSelection={false}
      disableRowGrouping
      disableAggregation
      disableColumnFilter
      sortModel={
        sorting
          .map((sort) => {
            const column = columns.find((column) => column.path === sort.path)
            if (column) {
              return {
                field: column.field,
                sort: sort.direction,
              }
            }
          })
          .filter((i) => i) as GridSortItem[]
      }
      onSortModelChange={(model) =>
        setSorting(
          model
            .map((sort) => {
              if (sort.sort) {
                const column = columns.find((column) => sort.field === column.field)
                if (column) {
                  return { direction: sort.sort, path: column.path }
                }
              }
            })
            .filter((i) => i) as WorkspaceInventorySearchTableSort[],
        )
      }
      pagination={dataCount > 10}
      paginationModel={{ page, pageSize: rowsPerPage }}
      onPaginationModelChange={(model) => {
        if (model.pageSize !== rowsPerPage) {
          setRowsPerPage(model.pageSize)
        }
        if (model.page !== page) {
          setPage(model.page)
        }
      }}
      paginationMode="server"
      rowCount={dataCount}
      getRowId={(row: RowType) => row.INTERNAL_ID}
      headerToolbar={
        <Stack px={1} alignItems="end" width="100%">
          <DownloadCSVButton query={searchCrit} hasWarning={dataCount > panelUI.maxCSVDownload} />
        </Stack>
      }
      slots={{
        row: (rowProps: GridRowProps) => (
          <ButtonBase
            onClick={() =>
              navigate({
                pathname: `./resource-detail/${(rowProps.row as RowType)?.INTERNAL_ID.split('_').slice(0, -1).join('_')}`,
                search:
                  typeof rowProps.row?.name === 'string'
                    ? mergeLocationSearchValues({
                        ...getLocationSearchValues(window.location.search),
                        name: window.encodeURIComponent(rowProps.row?.name ?? '-'),
                      })
                    : window.location.search,
              })
            }
          >
            <GridRow {...rowProps} />
          </ButtonBase>
        ),
      }}
      slotProps={{
        row: {
          style: { cursor: 'pointer' },
        },
      }}
    />
  ) : null
}
