import { TablePagination } from '@mui/material'
import { ChangeEvent } from 'react'
import { useTableViewPageScroll } from 'src/shared/layouts/panel-layout'
import { GetWorkspaceCloudAccountsResponse } from 'src/shared/types/server'

interface AccountsPaginationProps {
  data: GetWorkspaceCloudAccountsResponse | undefined
  page: number
  rowsPerPage: number
  setPage: (page: number) => void
  setRowsPerPage: (page: number) => void
}

export const AccountsPagination = ({ data, page, rowsPerPage, setPage, setRowsPerPage }: AccountsPaginationProps) => {
  const tableContainerRef = useTableViewPageScroll()

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    tableContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={data?.length ?? 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      SelectProps={{ name: 'account-table-per-row-select' }}
    />
  )
}
