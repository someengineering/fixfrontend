import { Trans, t } from '@lingui/macro'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { Account } from 'src/shared/types/server'
import { AccountRow } from './AccountRow'
import { AccountTableTitle } from './AccountTableTitle'

interface AccountsTableRecentlyAddedProps {
  data: Account[]
  isTop: boolean
}

export const AccountsTableRecentlyAdded = ({ data, isTop }: AccountsTableRecentlyAddedProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  return (
    <Box minHeight="50%" mb={isTop ? { xs: 8, sm: 5 } : undefined}>
      <AccountTableTitle isTop={isTop}>
        <Trans>Added accounts</Trans>
      </AccountTableTitle>
      <TableViewPage
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
        }}
        minHeight={0}
      >
        <Table stickyHeader aria-label={t`Added accounts`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Cloud</Trans>
              </TableCell>
              <TableCell>
                <Trans>ID</Trans>
              </TableCell>
              <TableCell>
                <Trans>Name</Trans>
              </TableCell>
              <TableCell>
                <Trans>Resources</Trans>
              </TableCell>
              <TableCell>
                <Trans>Next scan</Trans>
              </TableCell>
              <TableCell>
                <Trans>Enabled</Trans>
              </TableCell>
              <TableCell>
                <Trans>Actions</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((account, i) => <AccountRow account={account} key={`${account.id}_${i}`} />)}
          </TableBody>
        </Table>
      </TableViewPage>
    </Box>
  )
}
