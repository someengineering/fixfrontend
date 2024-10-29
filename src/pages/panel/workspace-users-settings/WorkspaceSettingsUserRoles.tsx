import { Box, Stack, Typography } from '@mui/material'
import { WorkspaceUser } from 'src/shared/types/server'
import { roleOptions } from './roleOptions'

interface WorkspaceSettingsUserRolesProps {
  workspaceUser: WorkspaceUser
}

export const WorkspaceSettingsUserRoles = ({ workspaceUser }: WorkspaceSettingsUserRolesProps) => {
  const roles = roleOptions.filter(({ role }) => workspaceUser.roles[role])
  return (
    <Stack direction="row" flexWrap="wrap" gap={1} minWidth={roles.length > 1 ? 100 : undefined}>
      {roles.map(({ role, name }) => (
        <Box bgcolor="background.default" py={0.75} px={1.5} borderRadius="63px" key={role}>
          <Typography variant="subtitle2" fontWeight={500}>
            {name}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
