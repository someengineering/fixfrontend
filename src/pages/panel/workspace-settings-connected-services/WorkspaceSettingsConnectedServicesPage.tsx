import { t, Trans } from '@lingui/macro'
import { Alert, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { getWorkspaceNotificationsQuery } from 'src/pages/panel/shared/queries'
import { WorkspaceSettingsDiscordService } from './WorkspaceSettingsDiscordService'
import { WorkspaceSettingsEmailService } from './WorkspaceSettingsEmailService'
import { WorkspaceSettingsOpsgenieService } from './WorkspaceSettingsOpsgenieService'
import { WorkspaceSettingsPagerdutyService } from './WorkspaceSettingsPagerdutyService'
import { WorkspaceSettingsSlackService } from './WorkspaceSettingsSlackService'
import { WorkspaceSettingsTeamsService } from './WorkspaceSettingsTeamsService'

export default function WorkspaceSettingsConnectedServicesPage() {
  const { selectedWorkspace } = useUserProfile()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') as 'slack_added' | 'discord_added' | null
  const outcome = searchParams.get('outcome') as 'error' | 'success' | null
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    if (message === 'discord_added' || message === 'slack_added') {
      if (outcome === 'success') {
        showSnackbar(t`${message === 'discord_added' ? 'Discord' : 'Slack'} has been connected`, { alertColor: 'success' })
      } else {
        showSnackbar(t`An error occurred while connecting to ${message === 'discord_added' ? 'Discord' : 'Slack'}`, {
          alertColor: 'error',
          autoHideDuration: null,
        })
      }
    }
  }, [message, outcome, showSnackbar])
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-notifications', selectedWorkspace?.id ?? ''],
    queryFn: getWorkspaceNotificationsQuery,
    enabled: !!selectedWorkspace,
  })
  const noConnected = !data?.slack && !data?.discord && !data?.teams && !data?.pagerduty && !data?.email && !data?.opsgenie
  return noConnected ? (
    <Alert severity="info">
      <Trans>There's no connected services</Trans>
    </Alert>
  ) : (
    <Stack direction="row" flexWrap="wrap" gap={3} width="100%">
      <WorkspaceSettingsSlackService isLoading={isLoading} isConnected={!!data?.slack} />
      <WorkspaceSettingsDiscordService isLoading={isLoading} isConnected={!!data?.discord} />
      <WorkspaceSettingsTeamsService isLoading={isLoading} isConnected={!!data?.teams} defaultName={data?.teams?.name} />
      <WorkspaceSettingsPagerdutyService isLoading={isLoading} isConnected={!!data?.pagerduty} defaultName={data?.pagerduty?.name} />
      <WorkspaceSettingsEmailService
        isLoading={isLoading}
        isConnected={!!data?.email}
        defaultName={data?.email?.name}
        defaultEmail={data?.email?.email}
      />
      <WorkspaceSettingsOpsgenieService defaultName={data?.opsgenie?.name} isConnected={!!data?.opsgenie} isLoading={isLoading} />
    </Stack>
  )
}
