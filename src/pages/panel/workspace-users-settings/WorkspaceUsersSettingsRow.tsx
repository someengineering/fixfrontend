import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Checkbox, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { WorkspaceUser } from 'src/shared/types/server'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { WorkspaceSettingsUserActionRowItem } from './WorkspaceSettingsUserActionRowItem'
import { WorkspaceSettingsUserRoles } from './WorkspaceSettingsUserRoles'

interface WorkspaceUsersSettingsRowProps {
  workspaceUser: WorkspaceUser
  selected?: boolean
  onSelect?: (selected: boolean, workspaceUser: WorkspaceUser) => void
}

export const WorkspaceUsersSettingsRow = ({ workspaceUser, selected, onSelect }: WorkspaceUsersSettingsRowProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { checkPermissions } = useUserProfile()
  const [hasInvitePermission, hasRemoveUserPermission, hasReadRolesPermission] = checkPermissions('inviteTo', 'removeFrom', 'readRoles')
  return (
    <TableRow>
      {hasRemoveUserPermission ? (
        <TableCell width={42} sx={{ p: 0 }}>
          <Checkbox checked={selected} onChange={onSelect ? (_, checked) => onSelect(checked, workspaceUser) : undefined} sx={{ p: 0 }} />
        </TableCell>
      ) : null}
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
      <TableCell>
        {workspaceUser.last_login ? (
          <Tooltip title={new Date(workspaceUser.last_login).toLocaleString(locale)} arrow>
            <Typography variant="subtitle1" component="span">
              <Trans>
                {iso8601DurationToString(diffDateTimeToDuration(new Date(workspaceUser.last_login), new Date()), 1).toLowerCase()} ago
              </Trans>
            </Typography>
          </Tooltip>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>-</TableCell>
      {hasRemoveUserPermission || hasInvitePermission ? (
        <TableCell>
          <WorkspaceSettingsUserActionRowItem workspaceUser={workspaceUser} />
        </TableCell>
      ) : null}
    </TableRow>
  )
}
