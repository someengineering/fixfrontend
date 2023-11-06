import { Trans, t } from '@lingui/macro'
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared-queries'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { AccountRow } from './AccountRow'

export const AccountsTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountsQuery,
    enabled: !!selectedWorkspace?.id,
  })

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <TableViewPage
      pagination={
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      }
    >
      <Table stickyHeader aria-label={t`Accounts`}>
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
              <Trans>Configured</Trans>
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
            .map((account) => <AccountRow account={account} key={account.id} />)}
        </TableBody>
      </Table>
    </TableViewPage>
  )
}
