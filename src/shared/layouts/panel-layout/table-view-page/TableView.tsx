import { Paper, Stack, TableContainer, Toolbar } from '@mui/material'
import { PropsWithChildren, ReactNode, forwardRef } from 'react'
import { panelUI } from 'src/shared/constants'
import { TablePagination, TablePaginationProps } from './TablePagination'

interface TableViewProps extends PropsWithChildren {
  paginationProps?: TablePaginationProps
  headerToolbar?: ReactNode
  minHeight?: number
  stickyPagination?: boolean
}

export const TableView = forwardRef<HTMLDivElement | null, TableViewProps>(
  ({ headerToolbar, paginationProps, minHeight, children, stickyPagination }, ref) => {
    const pages = paginationProps?.pages ?? [...panelUI.tableRowsPerPages]
    const shouldHavePagination = paginationProps && paginationProps?.dataCount > pages[0]
    return (
      <Stack sx={{ width: '100%', minHeight }} flexGrow={1}>
        {headerToolbar ? <Toolbar sx={{ height: panelUI.headerHeight, p: '0!important' }}>{headerToolbar}</Toolbar> : null}
        <TableContainer ref={ref} id={paginationProps?.id} sx={{ flexGrow: 1 }}>
          {children}
        </TableContainer>
        {shouldHavePagination ? (
          <Stack height={panelUI.tablePaginationHeight + 'px'} position={stickyPagination ? 'sticky' : undefined} bottom={-30}>
            <Paper elevation={0}>
              <TablePagination {...paginationProps} pages={pages} />
            </Paper>
          </Stack>
        ) : null}
      </Stack>
    )
  },
)
