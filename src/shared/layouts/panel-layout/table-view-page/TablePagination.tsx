import { TablePagination as MuiTablePagination } from '@mui/material'
import { ChangeEvent } from 'react'
import { useTableViewPageScroll } from 'src/shared/layouts/panel-layout'

export interface TablePaginationProps {
  dataCount: number
  page: number
  rowsPerPage: number
  setPage: (page: number) => void
  setRowsPerPage: (page: number) => void
  name?: string
}

export const TablePagination = ({ dataCount, page, rowsPerPage, setPage, setRowsPerPage, name }: TablePaginationProps) => {
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
    <MuiTablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      labelDisplayedRows={dataCount < 0 ? () => `${page * rowsPerPage} - ${page * rowsPerPage + rowsPerPage}` : undefined}
      count={dataCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      SelectProps={{ name: `${name ?? 'none'}-table-per-row-select` }}
    />
  )
}
