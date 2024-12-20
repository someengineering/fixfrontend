import { t, Trans } from '@lingui/macro'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { panelUI, settingsStorageKeys } from 'src/shared/constants'
import { TableView } from 'src/shared/layouts/panel-layout'
import { usePersistState } from 'src/shared/utils/usePersistState'
import { getWorkspaceInvitesQuery } from './getWorkspaceInvites.query'
import { WorkspaceUsersSettingsPendingInvitationRow } from './WorkspaceUsersSettingsPendingInvitationRow'

export default function WorkspaceUsersSettingsPendingInvitationsPage() {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasDeleteInvitePermission = checkPermission('update')
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-invites', selectedWorkspace?.id],
    queryFn: getWorkspaceInvitesQuery,
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = usePersistState<number>(
    settingsStorageKeys.WorkspaceSettingsUserInvitationsTable.rowsPerPage,
    panelUI.tableRowsPerPages[0],
    (state) => typeof state === 'number' && (panelUI.tableRowsPerPages as unknown as number[]).includes(state),
  )
  return (
    <TableView
      paginationProps={{
        dataCount: data.length ?? 0,
        page,
        pages: [...panelUI.tableRowsPerPages],
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
            {hasDeleteInvitePermission ? (
              <TableCell>
                <Trans>Remove</Trans>
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((workspaceInvite, i) => (
              <WorkspaceUsersSettingsPendingInvitationRow
                workspaceInvite={workspaceInvite}
                key={`${workspaceInvite.workspace_id}_${workspaceInvite.user_email}_${i}`}
              />
            ))}
        </TableBody>
      </Table>
    </TableView>
  )
}
