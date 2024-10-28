import { IconButton, Menu } from '@mui/material'
import { useState } from 'react'
import { MoreVertIcon } from 'src/assets/icons'
import { WorkspaceUser } from 'src/shared/types/server'
import { DeleteInvitedExternalUserMenuItem } from './DeleteInvitedExternalUserMenuItem'
import { EditInvitedExternalUserMenuItem } from './EditInvitedExternalUserMenuItem'

interface WorkspaceSettingsUserActionRowItemProps {
  workspaceUser: WorkspaceUser
}

export const WorkspaceSettingsUserActionRowItem = ({ workspaceUser }: WorkspaceSettingsUserActionRowItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
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
        <EditInvitedExternalUserMenuItem workspaceUser={workspaceUser} onClick={() => setAnchorEl(null)} />
        <DeleteInvitedExternalUserMenuItem workspaceUser={workspaceUser} onClick={() => setAnchorEl(null)} />
      </Menu>
    </>
  )
}
