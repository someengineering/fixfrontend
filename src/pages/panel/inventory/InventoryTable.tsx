import { Trans, t } from '@lingui/macro'
import { Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { GTMEventNames, panelUI } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import {
  PostWorkspaceInventorySearchTableColumn,
  PostWorkspaceInventorySearchTableResponse,
  PostWorkspaceInventorySearchTableRow,
} from 'src/shared/types/server'
import { isAuthenticated as getIsAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { DownloadCSVButton } from './DownloadCSVButton'
import { InventoryRow } from './InventoryRow'
import { ResourceDetail } from './ResourceDetail'

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
  const [selectedRow, setSelectedRow] = useState<PostWorkspaceInventorySearchTableRow>()

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
      <TableViewPage
        paginationProps={{
          dataCount,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
        }}
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
                <TableCell key={`${column.name}-${i}`}>{column.display}</TableCell>
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
              : rows?.map((row, i) => <InventoryRow onClick={setSelectedRow} key={`${row.id}-${i}`} row={row} columns={columns} />)}
          </TableBody>
        </Table>
        {isLoading && (!rows.length || !columns.length) ? <LoadingSuspenseFallback /> : null}
      </TableViewPage>
      <ResourceDetail detail={selectedRow} onClose={() => setSelectedRow(undefined)} />
    </>
  ) : null
}
