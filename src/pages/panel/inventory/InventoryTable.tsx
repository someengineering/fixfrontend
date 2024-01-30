import { Trans, t } from '@lingui/macro'
import { Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { GTMEventNames, panelUI } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { TableView } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import {
  PostWorkspaceInventorySearchTableColumn,
  PostWorkspaceInventorySearchTableResponse,
  PostWorkspaceInventorySearchTableRow,
} from 'src/shared/types/server'
import { isAuthenticated as getIsAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { DownloadCSVButton } from './DownloadCSVButton'
import { InventoryRow } from './InventoryRow'

interface InventoryTableProps {
  searchCrit: string
  history?: {
    after: string
    before: string
    change: string
  }
}

export const InventoryTable = ({ searchCrit, history }: InventoryTableProps) => {
  const [dataCount, setDataCount] = useState(-1)
  const navigate = useAbsoluteNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const [rows, setRows] = useState<PostWorkspaceInventorySearchTableRow[]>([])
  const [columns, setColumns] = useState<PostWorkspaceInventorySearchTableColumn[]>([])
  const initializedRef = useRef(false)
  const { data: serverData, isLoading } = useQuery({
    queryKey: [
      'workspace-inventory-search-table',
      selectedWorkspace?.id,
      searchCrit,
      page * rowsPerPage,
      rowsPerPage,
      page === 0 || dataCount === -1,
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
      setColumns(newColumns)
      setRows(newRows)
    }
  }, [data, isLoading])

  return columns.length ? (
    <>
      <TableView
        paginationProps={{
          dataCount,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: 'InventoryTable',
        }}
        stickyPagination
        headerToolbar={
          <Stack px={1} alignItems="end" width="100%">
            {totalCount > panelUI.maxCSVDownload ? (
              <Tooltip title={<Trans>Only first {panelUI.maxCSVDownload} items will be downloaded</Trans>}>
                <DownloadCSVButton query={searchCrit} warning />
              </Tooltip>
            ) : (
              <DownloadCSVButton query={searchCrit} />
            )}
          </Stack>
        }
      >
        <Table stickyHeader aria-label={t`Accounts`}>
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell key={`${column.name}-${i}`} sx={{ top: -25 }}>
                  {column.display}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? rows.length && columns.length
                ? rows.map((row, i) => (
                    <TableRow key={`${row.id}-${i}`}>
                      {columns.map((column, j) => (
                        <TableCell key={`${column.name}-${row.id}-${i}-${j}`}>
                          <Skeleton variant="rectangular" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null
              : rows?.map((row, i) => (
                  <InventoryRow
                    onClick={(item) =>
                      navigate({
                        pathname: `/inventory/resource-detail/${item.id}`,
                        search:
                          typeof item.row.name === 'string'
                            ? mergeLocationSearchValues({ ...searchValues, name: item.row.name })
                            : window.location.search,
                      })
                    }
                    key={`${row.id}-${i}`}
                    row={row}
                    columns={columns}
                  />
                ))}
          </TableBody>
        </Table>
        {isLoading && (!rows.length || !columns.length) ? <LoadingSuspenseFallback /> : null}
      </TableView>
    </>
  ) : null
}
