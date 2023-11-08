import { Trans, t } from '@lingui/macro'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared-queries'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { AccountRow } from './AccountRow'
import { AccountsPagination } from './AccountsPagination'

export const AccountsTable = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountsQuery,
    enabled: !!selectedWorkspace?.id,
  })

  return (
    <TableViewPage
      pagination={
        <AccountsPagination data={data} page={page} rowsPerPage={rowsPerPage} setPage={setPage} setRowsPerPage={setRowsPerPage} />
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
            .map((account, i) => <AccountRow account={account} key={`${account.id}_${i}`} />)}
        </TableBody>
      </Table>
    </TableViewPage>
  )
}
