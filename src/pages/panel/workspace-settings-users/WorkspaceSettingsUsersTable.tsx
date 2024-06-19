import { Trans, t } from '@lingui/macro'
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI, settingsStorageKeys } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { handleScrollIntoViewClickEvent } from 'src/shared/utils/handleScrollIntoViewClickEvent'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { InviteExternalUser } from './InviteExternalUser'
import { WorkspaceSettingsUserRow } from './WorkspaceSettingsUserRow'
import { getWorkspaceUsersQuery } from './getWorkspaceUsers.query'

export const WorkspaceSettingsUsersTable = () => {
  const { selectedWorkspace, checkPermissions } = useUserProfile()
  const [hasInvitePermission, hasRemoveUserPermission, hasReadRolesPermission] = checkPermissions('inviteTo', 'removeFrom', 'readRoles')
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-users', selectedWorkspace?.id],
    queryFn: getWorkspaceUsersQuery,
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState(
    settingsStorageKeys.WorkspaceSettingsUsersTable.rowsPerPage,
    panelUI.tableRowsPerPages[0] as number,
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  return (
    <>
      <Stack pb={2} justifyContent="space-between" direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Typography variant="h3">
          <Trans>Workspace Users</Trans>
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button href="#pending-invitations" onClick={handleScrollIntoViewClickEvent} variant="outlined">
            <Trans>Pending Invitations</Trans>
          </Button>
          {hasInvitePermission ? <InviteExternalUser /> : null}
        </Stack>
      </Stack>
      <TableView
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          pages: [...panelUI.tableRowsPerPages],
          rowsPerPage,
          setPage,
          setRowsPerPage,
          id: 'WorkspaceSettingsUsersTable',
        }}
        minHeight={200}
        stickyPagination
      >
        <Table stickyHeader aria-label={t`Workspace Users`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>Sources</Trans>
              </TableCell>
              <TableCell>
                <Trans>Name</Trans>
              </TableCell>
              <TableCell>
                <Trans>Email</Trans>
              </TableCell>
              {hasReadRolesPermission ? (
                <TableCell>
                  <Trans>Roles</Trans>
                </TableCell>
              ) : null}
              <TableCell>
                <Trans>Last login</Trans>
              </TableCell>
              <TableCell>
                <Trans>Invites</Trans>
              </TableCell>
              {hasRemoveUserPermission ? (
                <TableCell>
                  <Trans>Actions</Trans>
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((workspaceUser, i) => (
                <WorkspaceSettingsUserRow workspaceUser={workspaceUser} key={`${workspaceUser.id}_${workspaceUser.email}_${i}`} />
              ))}
          </TableBody>
        </Table>
      </TableView>
    </>
  )
}
