import { Trans, t } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI, settingsStorageKeys } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { WorkspaceSettingsUserInvitationRow } from './WorkspaceSettingsUserInvitationRow'
import { getWorkspaceInvitesQuery } from './getWorkspaceInvites.query'

export const WorkspaceSettingsUserInvitationsTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-invites', selectedWorkspace?.id],
    queryFn: getWorkspaceInvitesQuery,
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState(settingsStorageKeys.WorkspaceSettingsUserInvitationsTable.rowsPerPage, 5)
  return (
    <>
      <Stack pb={2} justifyContent="space-between" direction="row" id="pending-invitations">
        <Typography variant="h3">
          <Trans>Pending Invitations</Trans>
        </Typography>
      </Stack>
      <TableView
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          pages: [5, ...panelUI.tableRowsPerPages],
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: 'WorkspaceSettingsUserInvitationsTable',
        }}
        minHeight={200}
        stickyPagination
      >
        <Table stickyHeader aria-label={t`Pending Invitations`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Email</Trans>
              </TableCell>
              <TableCell>
                <Trans>Expires</Trans>
              </TableCell>
              <TableCell>
                <Trans>Remove</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((workspaceInvite, i) => (
                <WorkspaceSettingsUserInvitationRow
                  workspaceInvite={workspaceInvite}
                  key={`${workspaceInvite.workspace_id}_${workspaceInvite.user_email}_${i}`}
                />
              ))}
          </TableBody>
        </Table>
      </TableView>
    </>
  )
}
