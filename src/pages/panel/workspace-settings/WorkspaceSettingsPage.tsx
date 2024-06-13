import { Trans } from '@lingui/macro'
import CloudIcon from '@mui/icons-material/Cloud'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { useHasAccountsCheck } from 'src/shared/layouts/panel-layout'
import { WorkspaceSettingsForm } from './WorkspaceSettingsForm'
import { WorkspaceAlertingSettings } from './workspace-alerting-settings'
import { WorkspaceSettingsConnectedServices } from './workspace-settings-services'

export default function WorkspaceSettingsPage() {
  const navigate = useAbsoluteNavigate()
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
      <Typography variant="h3">
        <Trans>Other Workspace Settings</Trans>
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="start">
        <Button
          variant="outlined"
          href="workspace-settings/accounts"
          onClick={(e) => {
            e.preventDefault()
            navigate('workspace-settings/accounts')
          }}
          startIcon={<CloudIcon />}
        >
          <Trans>Accounts</Trans>
        </Button>
        <Button
          variant="outlined"
          href="workspace-settings/users"
          onClick={(e) => {
            e.preventDefault()
            navigate('workspace-settings/users')
          }}
          startIcon={<PeopleIcon />}
        >
          <Trans>Users</Trans>
        </Button>
        <Button
          variant="outlined"
          href="workspace-settings/billing-receipts"
          onClick={(e) => {
            e.preventDefault()
            navigate('workspace-settings/billing-receipts')
          }}
          startIcon={<ReceiptIcon />}
        >
          <Trans>Billing</Trans>
        </Button>
        {/* <Button variant="outlined" onClick={() => navigate('workspace-settings/external-directories')} startIcon={<FolderCopyIcon />}>
          <Trans>External Directories</Trans>
        </Button> */}
      </Stack>
    </Stack>
  )
}
