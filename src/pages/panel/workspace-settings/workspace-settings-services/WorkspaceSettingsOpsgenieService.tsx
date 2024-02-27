import { Trans, t } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PowerIcon from '@mui/icons-material/Power'
import SettingsIcon from '@mui/icons-material/Settings'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
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
      <Stack width={150} direction="row" spacing={1} alignItems="center">
        <Box width={30}>
          <OpsgenieLogo fill={theme.palette.common.black} />
        </Box>
        <Typography variant="h5">Opsgenie</Typography>
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
              We utilize incoming webhooks to deliver notifications to your Opsgenie channels.
              <br />
              More from{' '}
              <Button size="small" target="_blank" rel="noopener noreferrer" href="#" endIcon={<OpenInNewIcon />}>
                Opsgenie Documentation
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
