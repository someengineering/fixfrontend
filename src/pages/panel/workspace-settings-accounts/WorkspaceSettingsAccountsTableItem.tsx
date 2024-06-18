import { Trans } from '@lingui/macro'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { Account } from 'src/shared/types/server-shared'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { WorkspaceSettingsAccountRow } from './WorkspaceSettingsAccountRow'
import { WorkspaceSettingsAccountTableTitle } from './WorkspaceSettingsAccountTableTitle'

interface WorkspaceSettingsAccountsTableItemProps {
  data: Account[]
  title: string
  isTop: boolean
  isBottom: boolean
  isNotConfigured?: boolean
}

export const WorkspaceSettingsAccountsTableItem = ({
  data,
  title,
  isTop,
  isBottom,
  isNotConfigured,
}: WorkspaceSettingsAccountsTableItemProps) => {
  const { checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateCloudAccounts')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState(
    'AccountsTableItem.rowsPerPage',
    panelUI.tableRowsPerPages[0] as number,
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  return (
    <Box mb={isBottom ? undefined : { xs: 8, sm: 5 }} mt={isTop ? undefined : { sm: 3 }}>
      <WorkspaceSettingsAccountTableTitle isTop={isTop}>{title}</WorkspaceSettingsAccountTableTitle>
      <TableView
        stickyPagination
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: `AccountsTableItem_${title}`,
        }}
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
              {isNotConfigured ? null : (
                <>
                  <TableCell>
                    <Trans>Next scan</Trans>
                  </TableCell>
                  {hasPermission ? (
                    <>
                      <TableCell>
                        <Trans>Enabled</Trans>
                      </TableCell>
                      <TableCell>
                        <Trans>Security Scan</Trans>
                      </TableCell>
                    </>
                  ) : null}
                </>
              )}
              {hasPermission ? (
                <TableCell>
                  <Trans>Actions</Trans>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((account, i) => (
                <WorkspaceSettingsAccountRow account={account} key={`${account.id}_${i}`} isNotConfigured={isNotConfigured} />
              ))}
          </TableBody>
        </Table>
      </TableView>
    </Box>
  )
}
