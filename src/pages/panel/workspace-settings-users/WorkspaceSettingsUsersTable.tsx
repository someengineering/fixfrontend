import { Trans, t } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { InviteExternalUser } from './InviteExternalUser'
import { WorkspaceSettingsUserRow } from './WorkspaceSettingsUserRow'
import { getWorkspaceInvitesQuery } from './getWorkspaceInvites.query'
import { getWorkspaceUsersQuery } from './getWorkspaceUsers.query'

export const WorkspaceSettingsUsersTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const data = useSuspenseQueries({
    queries: [
      {
        queryKey: ['workspace-users', selectedWorkspace?.id],
        queryFn: getWorkspaceUsersQuery,
      },
      {
        queryKey: ['workspace-invites', selectedWorkspace?.id],
        queryFn: getWorkspaceInvitesQuery,
      },
    ],
    combine: (data) => {
      const [workspaceUsersResult, workspaceInvitesResult] = data
      if (!workspaceUsersResult?.data) {
        return []
      }
      return workspaceUsersResult.data.map((workspaceUser) => ({
        ...workspaceUser,
        invites: workspaceInvitesResult?.data?.length
          ? workspaceInvitesResult.data.filter((i) => i.user_email === workspaceUser.email)
          : [],
      }))
    },
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  return (
    <>
      <Stack pb={2} justifyContent="space-between" direction="row">
        <Typography variant="h3">
          <Trans>Workspace Users</Trans>
        </Typography>
        <InviteExternalUser />
      </Stack>
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
              <TableCell>
                <Trans>Roles</Trans>
              </TableCell>
              <TableCell>
                <Trans>Last login</Trans>
              </TableCell>
              <TableCell>
                <Trans>Invites</Trans>
              </TableCell>
              <TableCell>
                <Trans>Actions</Trans>
              </TableCell>
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
      </TableViewPage>
    </>
  )
}
