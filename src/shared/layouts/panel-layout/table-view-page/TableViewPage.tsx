import { Paper, Stack, TableContainer, Toolbar } from '@mui/material'
import { PropsWithChildren, ReactNode, useRef } from 'react'
import { panelUI } from 'src/shared/constants'
import { TablePagination, TablePaginationProps } from './TablePagination'
import { TableViewPageScrollContext } from './useTableViewPageScroll'

interface TableViewPageProps extends PropsWithChildren {
  paginationProps?: TablePaginationProps
  loading?: boolean
  minHeight?: number
  headerToolbar?: ReactNode
}

export const TableViewPage = ({ children, paginationProps, minHeight, headerToolbar }: TableViewPageProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const shouldHavePagination = paginationProps && paginationProps?.dataCount > panelUI.tableRowsPerPages[0]
  return (
    <TableViewPageScrollContext.Provider value={ref}>
      <Stack
        width="100%"
        direction="row"
        flexGrow={1}
        flexShrink={1}
        flexBasis={0}
        overflow="hidden"
        mb={-4}
        minHeight={minHeight ?? panelUI.tableViewMinHeight}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          {headerToolbar ? (
            <Toolbar sx={{ height: panelUI.headerHeight, bgcolor: 'background.default', p: '0!important' }}>{headerToolbar}</Toolbar>
          ) : null}
          <TableContainer
            sx={{
              height:
                shouldHavePagination || headerToolbar
                  ? `calc(100% - ${(shouldHavePagination ? panelUI.tablePaginationHeight : 0) + (headerToolbar ? panelUI.headerHeight : 0)}px)`
                  : '100%',
            }}
            ref={ref}
          >
            {children}
          </TableContainer>
          {shouldHavePagination ? (
            <Stack height={panelUI.tablePaginationHeight + 'px'}>
              <Paper elevation={9}>
                <TablePagination {...paginationProps} />
              </Paper>
            </Stack>
          ) : null}
        </Paper>
      </Stack>
    </TableViewPageScrollContext.Provider>
  )
}
