import { Trans, t } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { TeamsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { deleteWorkspaceNotificationTeamsMutation } from './deleteWorkspaceNotificationTeams.mutation'
import { putWorkspaceNotificationAddTeamsMutation } from './putWorkspaceNotificationAddTeams.mutation'

interface WorkspaceSettingsTeamsServiceProps {
  isConnected?: boolean
  config?: string
  isLoading?: boolean
}

export const WorkspaceSettingsTeamsService = ({ isConnected, config, isLoading }: WorkspaceSettingsTeamsServiceProps) => {
  const theme = useTheme()
  const { selectedWorkspace } = useUserProfile()
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddTeamsMutation })
  const [webhookUrl, setWebhookUrl] = useState('')
  const [name, setName] = useState(config ?? '')
  useEffect(() => {
    if (config) {
      setName(config)
    }
  }, [config])
  const queryClient = useQueryClient()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const handleConnect = () => {
    mutate(
      { workspaceId: selectedWorkspace?.id ?? '', webhook_url: webhookUrl, name },
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
      <Stack width={150} direction="row" spacing={1} alignItems="center">
        <Box width={30}>
          <TeamsLogo fill={theme.palette.common.black} />
        </Box>
        <Typography variant="h5">Teams</Typography>
      </Stack>
      {isConnected ? (
        <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} mutationFn={deleteWorkspaceNotificationTeamsMutation} name="Teams" />
      ) : null}
      <LoadingButton
        loadingPosition={isLoading && !isConnected ? 'start' : undefined}
        startIcon={isConnected ? undefined : <PowerIcon />}
        loading={isLoading}
        variant="contained"
        sx={{ flexShrink: 0 }}
        onClick={!isConnected ? () => modalRef.current?.(true) : undefined}
        disabled={isLoading || isConnected}
      >
        {isConnected ? <Trans>Configure</Trans> : <Trans>Connect</Trans>}
      </LoadingButton>
      <Modal
        onSubmit={handleConnect}
        openRef={modalRef}
        title={<Trans>Connect Teams</Trans>}
        description={
          <Trans>
            <Typography component="div">
              We utilize incoming webhooks to deliver notifications to your Microsoft Teams channels.
              <br />
              To manually add a webhook:
              <ol>
                <li>In Microsoft Teams, click on More options (⋯) next to the channel name and then select Connectors.</li>
                <li>Browse through the list of Connectors to find Incoming Webhook, and click Add.</li>
                <li>Provide a name for the webhook, upload an image to represent data from the webhook, and click Create.</li>
                <li>Copy the webhook URL to your clipboard and keep it safe. This URL is necessary for TrackJS to send notifications.</li>
                <li>Click Done.</li>
                <li>In the text box provided below, paste the Webhook URL you copied and enter the name of the channel.</li>
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
        </Stack>
      </Modal>
    </Stack>
  )
}
