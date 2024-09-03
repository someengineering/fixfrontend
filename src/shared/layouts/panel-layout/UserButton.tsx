import { Trans } from '@lingui/macro'
import { Avatar, Button, Divider, Stack, Typography } from '@mui/material'
import { AccountCircleIcon, CodeBlocksIcon, LogoutIcon } from 'src/assets/icons'
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
      <Stack spacing={1}>
        <Stack py={1} px={0.5} width={244} direction="row" spacing={1.5} alignItems="center">
          <Avatar {...avatarProps} sx={{ ...avatarProps.sx, width: 40, height: 40 }} />
          <Typography variant="buttonLarge" component="p" textOverflow="ellipsis" overflow="hidden" width="100%">
            {userEmail}
          </Typography>
        </Stack>
        <Divider flexItem />
        <Stack alignItems="stretch">
          <Button color="primary" startIcon={<AccountCircleIcon />} onClick={() => navigate('/user-settings')}>
            <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
              <Trans>User Settings</Trans>
            </Typography>
          </Button>
          <Button color="primary" startIcon={<CodeBlocksIcon />} onClick={() => navigate('/developer')}>
            <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
              <Trans>Developer</Trans>
            </Typography>
          </Button>
          <Button color="primary" startIcon={<LogoutIcon />} onClick={() => logout?.(true)}>
            <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
              <Trans>Logout</Trans>
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </PanelHeaderMenu>
  )
}
