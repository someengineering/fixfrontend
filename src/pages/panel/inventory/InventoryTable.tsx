import { ButtonBase, Stack } from '@mui/material'
import { GridColDef, GridRow, GridRowProps, GridSortItem } from '@mui/x-data-grid-premium'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { GTMEventNames, panelUI } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { AdvancedTableView } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import {
  PostWorkspaceInventorySearchTableColumn,
  PostWorkspaceInventorySearchTableResponse,
  PostWorkspaceInventorySearchTableRow,
  PostWorkspaceInventorySearchTableSort,
} from 'src/shared/types/server'
import { isAuthenticated as getIsAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
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

type RowType = PostWorkspaceInventorySearchTableRow['row'] & {
  INTERNAL_ID: string
}

type ColType = GridColDef & PostWorkspaceInventorySearchTableColumn

export const InventoryTable = ({ searchCrit, history }: InventoryTableProps) => {
  const [dataCount, setDataCount] = useState(-1)
  const navigate = useAbsoluteNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const [rows, setRows] = useState<RowType[]>([])
  const [columns, setColumns] = useState<ColType[]>([])
  const [sorting, setSorting] = useState<PostWorkspaceInventorySearchTableSort[]>([
    ...(history ? [{ direction: 'asc', path: '/changed_at' } as PostWorkspaceInventorySearchTableSort] : []),
    { direction: 'asc', path: '/reported.kind' },
    { direction: 'asc', path: '/reported.name' },
    { direction: 'asc', path: '/reported.id' },
  ])
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
  const searchValues = getLocationSearchValues(window.location.search)

  useEffect(() => {
    if (totalCount !== dataCount && dataCount === -1) {
      setDataCount(totalCount)
    }
  }, [totalCount, dataCount])

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
          minWidth: 100,
        })),
      )
      setRows(newRows.map(({ row, id }) => ({ INTERNAL_ID: id, ...row })))
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
            .filter((i) => i) as PostWorkspaceInventorySearchTableSort[],
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
                pathname: `/inventory/resource-detail/${(rowProps.row as RowType)?.INTERNAL_ID}`,
                search:
                  typeof (rowProps.row as RowType)?.name === 'string'
                    ? mergeLocationSearchValues({ ...searchValues, name: (rowProps.row as RowType)?.name as string })
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
