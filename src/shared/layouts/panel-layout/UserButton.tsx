import { Trans } from '@lingui/macro'
import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material'
import { AccountCircleIcon, CloudIcon, GroupIcon, LogoutIcon, WorkspaceSettingsIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { stringAvatar } from 'src/shared/utils/stringAvatar'
import { PanelHeaderMenu } from './PanelHeaderMenu'

export const UserButton = () => {
  const { currentUser, logout } = useUserProfile(true) ?? {}
  const userEmail = currentUser?.email ?? 'N/A'
  const navigate = useAbsoluteNavigate()
  const avatarProps = stringAvatar(userEmail)
  return (
    <PanelHeaderMenu Icon={Avatar} sx={{ width: 36, height: 36 }} color="primary" iconProps={avatarProps}>
      <Box pt={1.5} pb={1} px={1.5}>
        <Stack p={1.5} width={244} direction="row" spacing={1.5} alignItems="center">
          <Avatar {...avatarProps} sx={{ ...avatarProps.sx, width: 40, height: 40 }} />
          <Typography variant="buttonLarge" component="p" textOverflow="ellipsis" overflow="hidden" width="100%">
            {userEmail}
          </Typography>
        </Stack>
      </Box>
      <Divider flexItem />
      <Stack alignItems="stretch" px={1.5} py={1.5}>
        <Button color="info" startIcon={<AccountCircleIcon />} onClick={() => navigate('/user-settings')}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>User Settings</Trans>
          </Typography>
        </Button>
        <Button color="info" startIcon={<WorkspaceSettingsIcon />} onClick={() => navigate('/workspace-settings')}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Workspace Settings</Trans>
          </Typography>
        </Button>
        <Button color="info" startIcon={<GroupIcon />} onClick={() => navigate('/workspace-settings/users')}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Workspace Users</Trans>
          </Typography>
        </Button>
        <Button color="info" startIcon={<CloudIcon />} onClick={() => navigate('/workspace-settings/accounts')}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Cloud Accounts</Trans>
          </Typography>
        </Button>
        {/* <Button color="info" startIcon={<CodeBlocksIcon />} onClick={() => navigate('/developer')}>
            <Typography pl={0.5} width="100%" textAlign="start">
              <Trans>Developer</Trans>
            </Typography>
          </Button> */}
      </Stack>
      <Divider />
      <Stack alignItems="stretch" px={1.5} py={1.5}>
        <Button color="info" startIcon={<LogoutIcon />} onClick={() => logout?.(true)}>
          <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
            <Trans>Logout</Trans>
          </Typography>
        </Button>
      </Stack>
    </PanelHeaderMenu>
  )
}
