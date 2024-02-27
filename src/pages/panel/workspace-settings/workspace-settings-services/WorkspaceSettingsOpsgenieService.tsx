import { Trans, t } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import SettingsIcon from '@mui/icons-material/Settings'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { OpsgenieLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'
import { putWorkspaceNotificationAddMutation } from './putWorkspaceNotificationAdd.mutation'

interface WorkspaceSettingsOpsgenieServiceProps {
  isConnected?: boolean
  defaultName?: string
  isLoading?: boolean
}

export const WorkspaceSettingsOpsgenieService = ({ isConnected, defaultName, isLoading }: WorkspaceSettingsOpsgenieServiceProps) => {
  const theme = useTheme()
  const { selectedWorkspace } = useUserProfile()
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddMutation })
  const [webhookUrl, setWebhookUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [name, setName] = useState(defaultName ?? '')
  useEffect(() => {
    if (defaultName) {
      setName(defaultName)
    }
  }, [defaultName])
  const queryClient = useQueryClient()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const handleConnect = () => {
    mutate(
      { workspaceId: selectedWorkspace?.id ?? '', webhook_url: webhookUrl, api_key: apiKey, name, channel: 'opsgenie' },
      {
        onSettled: () => {
          void queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'workspace-notifications',
          })
          modalRef.current?.(false)
        },
      },
    )
  }
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'space-between', sm: 'start' }}>
      <Stack width={150} justifyContent="center">
        <OpsgenieLogo fill={theme.palette.common.black} width={120} />
      </Stack>
      {isConnected ? <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="opsgenie" name="Opsgenie" /> : null}
      <LoadingButton
        loadingPosition={isLoading && !isConnected ? 'start' : undefined}
        startIcon={isConnected ? <SettingsIcon /> : <PowerIcon />}
        loading={isLoading}
        variant="contained"
        sx={{ flexShrink: 0 }}
        onClick={() => modalRef.current?.(true)}
      >
        {isConnected ? <Trans>Configure</Trans> : <Trans>Connect</Trans>}
      </LoadingButton>
      {isConnected ? <WorkspaceSettingsTestService channel="opsgenie" isLoading={isLoading} /> : null}
      <Modal
        onSubmit={handleConnect}
        openRef={modalRef}
        title={<Trans>Connect Opsgenie</Trans>}
        description={
          <Trans>
            <Typography component="div">
              We utilize the OpsGenie API integration for notifications and alerts.
              <br />
              To set up this Integration, please follow these instructions:
              <ol>
                <li>
                  <strong>Navigate to the Dashboard:</strong> Find and click on the “Teams” section from the sidebar once logged in.
                </li>
                <li>
                  <strong>Select Your Team:</strong> Choose the team you want to integrate with. Within the team dashboard, go to the
                  “Integrations” tab.
                </li>
                <li>
                  <strong>Add Integration:</strong> Click on the “+ New Integration” button. Select “API” as the integration type, give it
                  the name “Fix,” and press Continue.
                </li>
                <li>
                  <strong>Turn Integration on:</strong> When the Integration has been created, it is disabled by default - click “Turn on
                  Integration”.
                </li>
                <li>
                  <strong>Copy API Key:</strong> Find and copy the API Key in the integration settings.
                </li>
              </ol>
            </Typography>
          </Trans>
        }
        actions={
          <>
            {isPending ? null : (
              <Button color="error" variant="outlined" onClick={() => modalRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton
              loadingPosition={isPending ? 'start' : undefined}
              startIcon={<PowerIcon />}
              loading={isPending}
              variant="contained"
              type="submit"
              disabled={!name || !webhookUrl}
            >
              <Trans>Connect</Trans>
            </LoadingButton>
          </>
        }
      >
        <Stack spacing={2}>
          <TextField
            required
            name="name"
            autoComplete="name"
            label={t`Name`}
            variant="outlined"
            fullWidth
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value ?? '')}
          />
          <TextField
            required
            name="webhook_url"
            autoComplete="url"
            label={t`Webhook URL`}
            variant="outlined"
            fullWidth
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value ?? '')}
          />
          <TextField
            required
            name="api_key"
            autoComplete="api_key"
            label={t`API Key`}
            variant="outlined"
            fullWidth
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value ?? '')}
          />
        </Stack>
      </Modal>
    </Stack>
  )
}
