import { Paper, Stack, TableContainer } from '@mui/material'
import { PropsWithChildren, ReactNode, useRef } from 'react'
import { panelUI } from 'src/shared/constants'
import { TableViewPageScrollContext } from './useTableViewPageScroll'

interface TableViewPageProps extends PropsWithChildren {
  pagination?: ReactNode
  loading?: boolean
}

export const TableViewPage = ({ children, pagination }: TableViewPageProps) => {
  const ref = useRef<HTMLDivElement>(null)
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
        minHeight={panelUI.tableViewMinHeight}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
          <TableContainer sx={{ height: pagination ? `calc(100% - ${panelUI.tablePaginationHeight}px)` : '100%' }} ref={ref}>
            {children}
          </TableContainer>
          {pagination ? (
            <Stack height={panelUI.tablePaginationHeight + 'px'}>
              <Paper elevation={9}>{pagination}</Paper>
            </Stack>
          ) : null}
        </Paper>
      </Stack>
    </TableViewPageScrollContext.Provider>
  )
}
