import { IconButton, Menu } from '@mui/material'
import { useState } from 'react'
import { MoreVertIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { WorkspaceUser } from 'src/shared/types/server'
import { DeleteInvitedExternalUserMenuItem } from './DeleteInvitedExternalUserMenuItem'
import { EditInvitedExternalUserMenuItem } from './EditInvitedExternalUserMenuItem'

interface WorkspaceSettingsUserActionRowItemProps {
  workspaceUser: WorkspaceUser
}

export const WorkspaceSettingsUserActionRowItem = ({ workspaceUser }: WorkspaceSettingsUserActionRowItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { checkPermissions } = useUserProfile()
  const [hasUpdateRolePermission, hasRemoveUserPermission] = checkPermissions('updateRoles', 'removeFrom')

  return hasUpdateRolePermission || hasRemoveUserPermission ? (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { bgcolor: 'common.white' } } }}
      >
        {hasUpdateRolePermission ? (
          <EditInvitedExternalUserMenuItem workspaceUser={workspaceUser} onClose={() => setAnchorEl(null)} />
        ) : null}
        {hasRemoveUserPermission ? (
          <DeleteInvitedExternalUserMenuItem workspaceUserIds={[workspaceUser.id]} onClose={() => setAnchorEl(null)} />
        ) : null}
      </Menu>
    </>
  ) : null
}
