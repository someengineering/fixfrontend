import { t } from '@lingui/macro'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { TablePagination, TableViewPage } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import {
  GetWorkspaceInventorySearchTableColumn,
  GetWorkspaceInventorySearchTableResponse,
  GetWorkspaceInventorySearchTableRow,
} from 'src/shared/types/server'
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
  const [rows, setRows] = useState<GetWorkspaceInventorySearchTableRow[]>([])
  const [columns, setColumns] = useState<GetWorkspaceInventorySearchTableColumn[]>([])
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
    queryFn: getWorkspaceInventorySearchTableQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const [data, totalCount] = serverData ?? [[{ columns: [] }] as GetWorkspaceInventorySearchTableResponse, -1]
  const [selectedRow, setSelectedRow] = useState<GetWorkspaceInventorySearchTableRow>()

  useEffect(() => {
    if (totalCount !== dataCount && dataCount === -1) {
      setDataCount(totalCount)
    }
  }, [totalCount, dataCount])

  useEffect(() => {
    setDataCount(-1)
    setPage(0)
  }, [searchCrit])

  useEffect(() => {
    if (!isLoading) {
      const [{ columns: newColumns }, ...newRows] = data ?? [{ columns: [] }]
      setColumns(newColumns)
      setRows(newRows)
    }
  }, [data, isLoading])

  useEffect(() => {
    if (!isLoading) {
      const rowsLength = (data?.length ?? 1) - 1
      if (rowsLength < rowsPerPage) {
        setDataCount(rowsLength + page * rowsPerPage)
      }
    }
  }, [isLoading, rowsPerPage, page, data?.length])

  return columns.length ? (
    <>
      <TableViewPage
        pagination={
          <TablePagination dataCount={dataCount} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} />
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
