import { Trans } from '@lingui/macro'
import { Divider, Stack, Typography } from '@mui/material'
import { useHasAccountsCheck } from 'src/shared/layouts/panel-layout'
import { WorkspaceSettingsForm } from './WorkspaceSettingsForm'
import { WorkspaceAlertingSettings } from './workspace-alerting-settings'
import { WorkspaceSettingsConnectedServices } from './workspace-settings-services'

export default function WorkspaceSettingsPage() {
  const { doesNotHaveAccount, haveError, paymentOnHold } = useHasAccountsCheck()

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h3">
        <Trans>Workspace Settings</Trans>
      </Typography>
      <WorkspaceSettingsForm />
      <Stack py={2}>
        <Divider />
      </Stack>
      {!doesNotHaveAccount && !haveError && !paymentOnHold ? (
        <>
          <Typography variant="h3">
            <Trans>Connected Services</Trans>
          </Typography>
          <WorkspaceSettingsConnectedServices />
          <Stack py={2}>
            <Divider />
          </Stack>
          <Typography variant="h3">
            <Trans>Alerting Settings</Trans>
          </Typography>
          <WorkspaceAlertingSettings />
          <Stack py={2}>
            <Divider />
          </Stack>
        </>
      ) : null}
    </Stack>
  )
}
