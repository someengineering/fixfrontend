import { t } from '@lingui/macro'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventorySearchTableQuery } from 'src/pages/panel/shared/queries'
import { TablePagination, TableViewPage } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { GetWorkspaceInventorySearchTableColumn, GetWorkspaceInventorySearchTableRow } from 'src/shared/types/server'
import { InventoryRow } from './InventoryRow'

interface InventoryTableProps {
  searchCrit: string
}

export const InventoryTable = ({ searchCrit }: InventoryTableProps) => {
  const [dataCount, setDataCount] = useState(-1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const [rows, setRows] = useState<GetWorkspaceInventorySearchTableRow[]>([])
  const [columns, setColumns] = useState<GetWorkspaceInventorySearchTableColumn[]>([])
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-inventory-search-table', selectedWorkspace?.id, `${searchCrit} limit ${page * rowsPerPage}, ${rowsPerPage}`],
    queryFn: getWorkspaceInventorySearchTableQuery,
  })

  useEffect(() => {
    setDataCount(-1)
    setPage(0)
  }, [searchCrit])

  useEffect(() => {
    const [{ columns: newColumns }, ...newRows] = data ?? [{ columns: [] }]
    if (!isLoading) {
      setColumns(newColumns)
      setRows(newRows)
    }
  }, [data, isLoading])

  useEffect(() => {
    if (!isLoading) {
      if (data?.length && data.length < rowsPerPage) {
        setDataCount(data.length + page * rowsPerPage)
      }
    }
  }, [data, isLoading, rowsPerPage, page])
  return columns.length ? (
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
            : rows?.map((row, i) => <InventoryRow key={`${row.id}-${i}`} row={row} columns={columns} />)}
        </TableBody>
      </Table>
      {isLoading && (!rows.length || !columns.length) ? <LoadingSuspenseFallback /> : null}
    </TableViewPage>
  ) : null
}
