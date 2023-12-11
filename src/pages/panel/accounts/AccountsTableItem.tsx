import { Trans } from '@lingui/macro'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'
import { TablePagination, TableViewPage } from 'src/shared/layouts/panel-layout'
import { Account } from 'src/shared/types/server'
import { AccountRow } from './AccountRow'
import { AccountTableTitle } from './AccountTableTitle'

interface AccountsTableItemProps {
  data: Account[]
  title: string
  isTop: boolean
  isBottom: boolean
}

export const AccountsTableItem = ({ data, title, isTop, isBottom }: AccountsTableItemProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  return (
    <Box mb={isBottom ? undefined : { xs: 8, sm: 5 }} mt={isTop ? undefined : { sm: 3 }}>
      <AccountTableTitle isTop={isTop}>{title}</AccountTableTitle>
      <TableViewPage
        pagination={
          <TablePagination
            dataCount={data.length ?? 0}
            page={page}
            rowsPerPage={rowsPerPage}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
          />
        }
        minHeight={380}
      >
        <Table stickyHeader aria-label={title}>
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
