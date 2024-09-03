import { Trans } from '@lingui/macro'
import { Button, Stack, Typography } from '@mui/material'
import { CloudIcon, GroupIcon, SettingsIcon, WorkspaceSettingsIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { PanelHeaderMenu } from './PanelHeaderMenu'

export const SettingsButton = () => {
  const navigate = useAbsoluteNavigate()
  return (
    <PanelHeaderMenu Icon={SettingsIcon}>
      <Stack>
        <Button color="primary" startIcon={<WorkspaceSettingsIcon />} onClick={() => navigate('/workspace-settings')}>
          <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
            <Trans>Workspace Settings</Trans>
          </Typography>
        </Button>
        <Button color="primary" startIcon={<GroupIcon />} onClick={() => navigate('/workspace-settings/users')}>
          <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
            <Trans>Workspace Users</Trans>
          </Typography>
        </Button>
        <Button color="primary" startIcon={<CloudIcon />} onClick={() => navigate('/workspace-settings/accounts')}>
          <Typography pl={0.5} width="100%" textAlign="start" color="textPrimary">
            <Trans>Cloud Accounts</Trans>
          </Typography>
        </Button>
      </Stack>
    </PanelHeaderMenu>
  )
}
