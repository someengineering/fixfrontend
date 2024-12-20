import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingButton } from '@mui/lab'
import { alpha, Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { OpenInNewIcon, PowerIcon, SettingsIcon, TeamsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { putWorkspaceNotificationAddMutation } from './putWorkspaceNotificationAdd.mutation'
import { WorkspaceSettingsConnectedServiceItemContainer } from './WorkspaceSettingsConnectedServiceItemContainer'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'

interface WorkspaceSettingsTeamsServiceProps {
  isConnected?: boolean
  defaultName?: string
  isLoading?: boolean
}

export const WorkspaceSettingsTeamsService = ({ isConnected, defaultName, isLoading }: WorkspaceSettingsTeamsServiceProps) => {
  const theme = useTheme()
  const {
    i18n: { locale },
  } = useLingui()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddMutation })
  const [webhookUrl, setWebhookUrl] = useState('')
  const [name, setName] = useState(defaultName ?? 'Teams Integration')
  useEffect(() => {
    if (defaultName) {
      setName(defaultName)
    }
  }, [defaultName])
  const queryClient = useQueryClient()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const handleConnect = () => {
    mutate(
      { workspaceId: selectedWorkspace?.id ?? '', webhook_url: webhookUrl, name, channel: 'teams' },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'workspace-notifications',
          })
          modalRef.current?.(false)
        },
      },
    )
  }
  return hasPermission || isConnected ? (
    <WorkspaceSettingsConnectedServiceItemContainer
      icon={
        <Stack direction="row" spacing={1}>
          <Box height={38}>
            <TeamsLogo height={38} color={theme.palette.common.black} />
          </Box>
          <Typography variant="h4">Teams</Typography>
        </Stack>
      }
    >
      {hasPermission ? (
        <>
          {isConnected ? (
            <>
              <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="teams" name="Teams" />
              <WorkspaceSettingsTestService channel="teams" isLoading={isLoading} />
            </>
          ) : null}
          <LoadingButton
            loadingPosition={isLoading && !isConnected ? 'start' : undefined}
            startIcon={isConnected ? <SettingsIcon /> : <PowerIcon />}
            loading={isLoading}
            variant="contained"
            sx={{ flexShrink: 0 }}
            onClick={() => modalRef.current?.(true)}
            color={isConnected ? 'primary' : 'success'}
          >
            {isConnected ? <Trans>Configure</Trans> : <Trans>Connect</Trans>}
          </LoadingButton>
          <Modal
            slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }}
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
                    <li>Copy the webhook URL to your clipboard and keep it safe.</li>
                    <li>Click Done.</li>
                    <li>In the text box provided below, paste the Webhook URL you copied and enter the name of the channel.</li>
                  </ol>
                  More from{' '}
                  <Button
                    size="small"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://learn.microsoft.com/${locale.toLowerCase()}/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using?tabs=cURL#setting-up-a-custom-incoming-webhook`}
                    endIcon={<OpenInNewIcon />}
                  >
                    Microsoft Teams Documentation
                  </Button>
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
                  loading={isPending}
                  variant="contained"
                  type="submit"
                  disabled={!name || !webhookUrl}
                  startIcon={isConnected ? <SettingsIcon /> : <PowerIcon />}
                  color={isConnected ? 'primary' : 'success'}
                >
                  {isConnected ? <Trans>Update</Trans> : <Trans>Connect</Trans>}
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
        </>
      ) : null}
    </WorkspaceSettingsConnectedServiceItemContainer>
  ) : null
}
