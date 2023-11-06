import { Paper, Stack, TableContainer } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'
import { panelUI } from 'src/shared/constants'

interface TableViewPageProps extends PropsWithChildren {
  pagination: ReactNode
}

export const TableViewPage = ({ children, pagination }: TableViewPageProps) => {
  return (
    <Stack width="100%" direction="row" flexGrow={1} flexShrink={1} flexBasis={0} overflow="hidden">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ height: pagination ? `calc(100% - ${panelUI.tablePaginationHeight}px)` : '100%' }}>{children}</TableContainer>
        <Stack height={panelUI.tablePaginationHeight + 'px'}>{pagination}</Stack>
      </Paper>
    </Stack>
  )
}
