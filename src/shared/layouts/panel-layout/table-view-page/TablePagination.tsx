import { TablePagination as MuiTablePagination } from '@mui/material'
import { ChangeEvent } from 'react'
import { panelUI } from 'src/shared/constants'
// eslint-disable-next-line no-restricted-imports
import { usePageScroll } from '../usePageScroll'

export interface TablePaginationProps {
  dataCount: number
  page: number
  pages?: number[]
  rowsPerPage: number
  setPage: (page: number) => void
  setRowsPerPage: (page: number) => void
  name?: string
  id?: string
}

export const TablePagination = ({
  dataCount,
  page,
  pages = [...panelUI.tableRowsPerPages],
  rowsPerPage,
  setPage,
  setRowsPerPage,
  id,
  name,
}: TablePaginationProps) => {
  const tableContainerRef = usePageScroll()

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    let top = 0
    if (id) {
      const newTop = window.document.getElementById(id)?.offsetTop
      if (newTop) {
        top = newTop
      }
    }
    tableContainerRef.current?.scrollTo({ top, behavior: 'smooth' })
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <MuiTablePagination
      rowsPerPageOptions={pages}
      component="div"
      labelDisplayedRows={dataCount < 0 ? () => `${page * rowsPerPage} - ${page * rowsPerPage + rowsPerPage}` : undefined}
      count={dataCount}
      rowsPerPage={rowsPerPage < pages[0] ? pages[0] : rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      slotProps={{
        select: { name: `${name ?? 'none'}-table-per-row-select` },
      }}
    />
  )
}
