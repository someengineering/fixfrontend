import { Trans } from '@lingui/macro'
import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material'
import { AccountCircleIcon, CloudIcon, GroupIcon, LogoutIcon, ReceiptIcon, WorkspaceSettingsIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { InternalLinkButton } from 'src/shared/link-button'
import { stringAvatar } from 'src/shared/utils/stringAvatar'
import { PanelHeaderMenu } from './PanelHeaderMenu'

export const UserButton = () => {
  const { currentUser, logout } = useUserProfile(true) ?? {}
  const userEmail = currentUser?.email ?? 'N/A'
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
        <InternalLinkButton color="info" startIcon={<AccountCircleIcon />} to={'/settings/user'}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>User Settings</Trans>
          </Typography>
        </InternalLinkButton>
        <InternalLinkButton color="info" startIcon={<WorkspaceSettingsIcon />} to={'/settings/workspace'}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Workspace Settings</Trans>
          </Typography>
        </InternalLinkButton>
        <InternalLinkButton color="info" startIcon={<GroupIcon />} to={'/settings/workspace-users'}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Workspace Users</Trans>
          </Typography>
        </InternalLinkButton>
        <InternalLinkButton color="info" startIcon={<CloudIcon />} to={'/accounts'}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Cloud Accounts</Trans>
          </Typography>
        </InternalLinkButton>
        <InternalLinkButton color="info" startIcon={<ReceiptIcon />} to={'/settings/workspace/billing-receipts'}>
          <Typography pl={0.5} width="100%" textAlign="start">
            <Trans>Billing</Trans>
          </Typography>
        </InternalLinkButton>
        {/* <InternalLinkButton color="info" startIcon={<CodeBlocksIcon />} to={'/developer'}>
            <Typography pl={0.5} width="100%" textAlign="start">
              <Trans>Developer</Trans>
            </Typography>
          </InternalLinkButton> */}
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
