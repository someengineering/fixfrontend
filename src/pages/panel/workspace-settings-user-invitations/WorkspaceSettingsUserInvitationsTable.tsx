import { Trans, t } from '@lingui/macro'
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { WorkspaceSettingsUserInvitationRow } from './WorkspaceSettingsUserInvitationRow'
import { getWorkspaceInvitesQuery } from './getWorkspaceInvites.query'

export const WorkspaceSettingsUserInvitationsTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-invites', selectedWorkspace?.id],
    queryFn: getWorkspaceInvitesQuery,
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  return (
    <>
      <Stack pb={2} justifyContent="space-between" direction="row">
        <Typography variant="h3">
          <Trans>Pending Invitations</Trans>
        </Typography>
      </Stack>
      <TableViewPage
        paginationProps={{
          dataCount: data.length ?? 0,
          page,
          rowsPerPage,
          setPage,
          setRowsPerPage,
        }}
        minHeight={200}
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
      </TableViewPage>
    </>
  )
}
