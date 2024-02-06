import { t } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { getWorkspaceNotificationsQuery } from 'src/pages/panel/shared/queries'
import { WorkspaceSettingsDiscordService } from './WorkspaceSettingsDiscordService'
import { WorkspaceSettingsEmailService } from './WorkspaceSettingsEmailService'
import { WorkspaceSettingsPagerdutyService } from './WorkspaceSettingsPagerdutyService'
import { WorkspaceSettingsSlackService } from './WorkspaceSettingsSlackService'
import { WorkspaceSettingsTeamsService } from './WorkspaceSettingsTeamsService'

export const WorkspaceSettingsConnectedServices = () => {
  const { selectedWorkspace } = useUserProfile()
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') as 'slack_added' | 'discord_added' | null
  const outcome = searchParams.get('outcome') as 'error' | 'success' | null
  const { showSnackbar } = useSnackbar()
  useEffect(() => {
    if (message === 'discord_added' || message === 'slack_added') {
      if (outcome === 'success') {
        void showSnackbar(t`${message === 'discord_added' ? 'Discord' : 'Slack'} has been connected`, { severity: 'success' })
      } else {
        void showSnackbar(t`An error occurred while connecting to ${message === 'discord_added' ? 'Discord' : 'Slack'}`, {
          severity: 'error',
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
  return (
    <>
      <WorkspaceSettingsSlackService isLoading={isLoading} isConnected={!!data?.slack} />
      <WorkspaceSettingsDiscordService isLoading={isLoading} isConnected={!!data?.discord} />
      <WorkspaceSettingsTeamsService isLoading={isLoading} isConnected={!!data?.teams} />
      <WorkspaceSettingsPagerdutyService isLoading={isLoading} isConnected={!!data?.pagerduty} />
      <WorkspaceSettingsEmailService
        isLoading={isLoading}
        isConnected={!!data?.email}
        defaultName={data?.email.name}
        defaultEmail={data?.email.email}
      />
    </>
  )
}
