import { useLingui } from '@lingui/react'
import { Stack, TableCell, TableRow, Typography } from '@mui/material'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { WorkspaceUser } from 'src/shared/types/server'
import { WorkspaceSettingsUserActionRowItem } from './WorkspaceSettingsUserActionRowItem'
import { WorkspaceSettingsUserRoles } from './WorkspaceSettingsUserRoles'

interface WorkspaceSettingsUserRowProps {
  workspaceUser: WorkspaceUser
}

export const WorkspaceSettingsUserRow = ({ workspaceUser }: WorkspaceSettingsUserRowProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { checkPermissions } = useUserProfile()
  const [hasReadRolesPermission] = checkPermissions('removeFrom', 'readRoles')
  return (
    <TableRow>
      <TableCell>
        {workspaceUser.sources.length ? (
          <Stack direction="row" flexWrap="wrap" gap={1} minWidth={workspaceUser.sources.length > 1 ? 100 : undefined}>
            {workspaceUser.sources.map(({ source }) => (
              <CloudAvatar key={source} cloud={source} />
            ))}
          </Stack>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700}>
            {workspaceUser.name || '-'}
          </Typography>
          <Typography variant="subtitle2" fontWeight={500} color="textSecondary">
            {workspaceUser.email || '-'}
          </Typography>
        </Stack>
      </TableCell>
      {hasReadRolesPermission ? (
        <TableCell>
          <WorkspaceSettingsUserRoles workspaceUser={workspaceUser} />
        </TableCell>
      ) : null}
      <TableCell>{workspaceUser.last_login ? new Date(workspaceUser.last_login).toLocaleString(locale) : '-'}</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <WorkspaceSettingsUserActionRowItem workspaceUser={workspaceUser} />
      </TableCell>
    </TableRow>
  )
}
