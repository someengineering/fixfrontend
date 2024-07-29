import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material'
import { GridRow, GridRowProps, GridSortItem } from '@mui/x-data-grid-premium'
import { useQueries } from '@tanstack/react-query'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryModelQuery, postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { AdvancedTableView } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { PostHogEvent } from 'src/shared/posthog'
import {
  PostWorkspaceInventorySearchTableResponse,
  WorkspaceInventorySearchTableHistory,
  WorkspaceInventorySearchTableRow,
  WorkspaceInventorySearchTableSort,
} from 'src/shared/types/server'
import { ResourceKind } from 'src/shared/types/server-shared'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { DownloadCSVButton } from './DownloadCSVButton'
import { ColType } from './utils'
import { inventoryTableCellHasIcon } from './utils/inventoryTableCellHasIcon'
import { inventoryTableRenderCell } from './utils/inventoryTableRenderCell'

interface InventoryTableProps {
  searchCrit: string
  history?: WorkspaceInventorySearchTableHistory
}

type RowType = WorkspaceInventorySearchTableRow['row'] & {
  INTERNAL_ID: string
}

export const InventoryTable = ({ searchCrit, history }: InventoryTableProps) => {
  const postHog = usePostHog()
  const { sorts } = useFixQueryParser()
  const [dataCount, setDataCount] = useState(-1)
  const navigate = useAbsoluteNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState<number>(
    'InventoryTable.rowsPerPage',
    panelUI.tableRowsPerPages[0],
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  const { currentUser, selectedWorkspace } = useUserProfile()
  const [rows, setRows] = useState<RowType[]>([])
  const [columns, setColumns] = useState<ColType[]>([])
  const [sorting, setSorting] = useState<WorkspaceInventorySearchTableSort[]>(
    sorts.length
      ? sorts.map((sort) => ({ direction: sort.order, path: sort.path.toString() }))
      : [
          ...(history ? [{ direction: 'desc', path: '/changed_at' } as WorkspaceInventorySearchTableSort] : []),
          { direction: 'asc', path: '/reported.kind' },
          { direction: 'asc', path: '/reported.name' },
          { direction: 'asc', path: '/reported.id' },
        ],
  )
  const initializedRef = useRef(false)
  const [{ data: serverData, isLoading: isServerLoading }, { data: modelData, isLoading: isModelLoading }] = useQueries({
    queries: [
      {
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
      },
      {
        queryKey: ['workspace-inventory-model', selectedWorkspace?.id, undefined, false, false, true, false, false, true, false],
        queryFn: getWorkspaceInventoryModelQuery,
        enabled: !!selectedWorkspace?.id,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
      },
    ],
  })
  const isLoading = isServerLoading || isModelLoading
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

  const historyStr = `${(history?.changes ?? []).join(',')}_from_${history?.after}_to_${history?.before}`

  useEffect(() => {
    if (initializedRef.current) {
      setDataCount(-1)
      setPage(0)
    }
    initializedRef.current = true
    postHog.capture(PostHogEvent.InventorySearch, {
      $set: { ...currentUser },
      authenticated: isAuthenticated(),
      user_id: currentUser?.id,
      workspace_id: selectedWorkspace?.id,
      query: searchCrit,
      historyStr,
    })
  }, [currentUser, postHog, searchCrit, historyStr, selectedWorkspace?.id])

  useEffect(() => {
    if (!isLoading) {
      const [{ columns: newColumns }, ...newRows] = data ?? [{ columns: [] }]
      const foundModel =
        modelData?.reduce((prev, kind) => ({ ...prev, [kind.fqn]: { ...kind } }), {} as Record<string, ResourceKind>) ??
        ({} as Record<string, ResourceKind>)
      setColumns(
        newColumns.map(
          (i) =>
            ({
              ...i,
              field: i.name,
              headerName: i.display,
              flex: inventoryTableCellHasIcon(i) ? undefined : 1,
              type:
                i.kind === 'boolean' || i.kind === 'date'
                  ? i.kind
                  : i.kind === 'datetime'
                    ? 'dateTime'
                    : i.kind === 'double' || i.kind === 'float' || i.kind === 'int32' || i.kind === 'int64'
                      ? 'number'
                      : 'string',
              display: 'flex',
              valueGetter:
                i.kind === 'date' || i.kind === 'datetime'
                  ? (value) => new Date(value)
                  : i.kind === 'boolean'
                    ? (value) => (typeof value === 'boolean' ? value : value === 'true' ? true : value === 'false' ? false : null)
                    : undefined,
              renderCell: inventoryTableRenderCell(i, foundModel),
              minWidth: inventoryTableCellHasIcon(i) ? 110 : 150,
              width: inventoryTableCellHasIcon(i) ? 110 : undefined,
              renderHeader: (value) => (
                <Tooltip
                  title={
                    <Typography color="primary.main" variant="caption" fontWeight={800}>
                      {value.colDef?.headerName ?? value.colDef?.field ?? ''}
                    </Typography>
                  }
                  arrow
                >
                  <Stack
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    flexWrap="wrap"
                    direction="row-reverse"
                    justifyContent="start"
                    spacing={1}
                    height={20}
                  >
                    {(value.colDef?.headerName ?? value.colDef?.field ?? '')
                      .split(' ➞ ')
                      .reverse()
                      .map((chunk, i) => (
                        <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" key={i} display="inline" component="span">
                          {chunk}
                          {i ? ' ➞ ' : ''}
                        </Box>
                      ))}
                  </Stack>
                </Tooltip>
              ),
            }) as ColType,
        ),
      )
      setRows(newRows.map(({ row, id }, i) => ({ INTERNAL_ID: id + '_' + i, ...row })))
    }
  }, [data, isLoading, modelData])

  return isLoading && !rows.length && !columns.length ? (
    <Box height="calc(100% - 180px)">
      <LoadingSuspenseFallback />
    </Box>
  ) : columns.length ? (
    <AdvancedTableView
      loading={Boolean(isLoading && rows.length && columns.length)}
      autoHeight
      columns={columns}
      rows={rows}
      pageSizeOptions={panelUI.tableRowsPerPages.filter((_, i, arr) => dataCount > (arr[i - 1] ?? 0))}
      filterMode="server"
      sortingMode="server"
      rowSelection={false}
      disableRowGrouping
      disableAggregation
      disableColumnFilter
      sortModel={
        sorting
          .map((sort) => {
            const column = columns.find((column) => column.path === sort.path || column.name.toLowerCase() === sort.path.toLowerCase())
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
      pagination={dataCount > panelUI.tableRowsPerPages[0]}
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
          <DownloadCSVButton query={searchCrit} hasWarning={dataCount > panelUI.maxCSVDownload} history={history} sort={sorting} />
        </Stack>
      }
      slots={{
        row: (rowProps: GridRowProps) => {
          const id = (rowProps.row as RowType)?.INTERNAL_ID.split('_').slice(0, -1).join('_')
          if (!id || id === 'null' || id === 'undefined') {
            return <GridRow {...rowProps} />
          }
          const search =
            typeof rowProps.row?.name === 'string'
              ? mergeLocationSearchValues({
                  ...getLocationSearchValues(window.location.search),
                  name: window.encodeURIComponent(rowProps.row?.name ?? '-'),
                  ...(typeof rowProps.row?.cloud === 'string' ? { cloud: window.encodeURIComponent(rowProps.row?.cloud ?? '-') } : {}),
                })
              : window.location.search
          const href = `./resource-detail/${id}${search?.[0] === '?' || !search ? search ?? '' : `?${search}`}`
          return (
            <ButtonBase
              href={href}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(href)
              }}
            >
              <GridRow {...rowProps} />
            </ButtonBase>
          )
        },
      }}
    />
  ) : null
}
