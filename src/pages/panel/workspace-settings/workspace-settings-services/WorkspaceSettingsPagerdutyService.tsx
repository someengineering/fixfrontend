import { Trans, t } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { PagerdutyLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { deleteWorkspaceNotificationPagerdutyMutation } from './deleteWorkspaceNotificationPagerduty.mutation'
import { putWorkspaceNotificationAddPagerdutyMutation } from './putWorkspaceNotificationAddPagerduty.mutation'

interface WorkspaceSettingsPagerdutyServiceProps {
  isConnected?: boolean
  config?: string
  isLoading?: boolean
}

export const WorkspaceSettingsPagerdutyService = ({ isConnected, config, isLoading }: WorkspaceSettingsPagerdutyServiceProps) => {
  const theme = useTheme()
  const { selectedWorkspace } = useUserProfile()
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddPagerdutyMutation })
  const [integrationKey, setIntegrationKey] = useState('')
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
      { workspaceId: selectedWorkspace?.id ?? '', integration_key: integrationKey, name },
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
      <Box width={150}>
        <PagerdutyLogo fill={theme.palette.common.black} width={100} />
      </Box>
      {isConnected ? (
        <WorkspaceSettingsDisconnectServiceModal
          isLoading={isLoading}
          mutationFn={deleteWorkspaceNotificationPagerdutyMutation}
          name="PagerDuty"
        />
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
        title={<Trans>Connect PagerDuty</Trans>}
        description={
          <Trans>
            <Typography component="div">
              We use the Events API V2 for notifications through PagerDuty.
              <br />
              To create an integration, please follow these steps:
              <ol>
                <li>Log in to PagerDuty with your account credentials.</li>
                <li>Navigate to the dashboard and select "Services".</li>
                <li>Choose the service you wish to integrate, go to the "Integrations" tab, and then click "Add Integration".</li>
                <li>For the integration type, select "PagerDuty Events API V2" and click "Add".</li>
                <li>Provide a name for the integration for easy reference and copy the "Integration Key".</li>
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
              disabled={!name || !integrationKey}
            >
              <Trans>Connect</Trans>
            </LoadingButton>
          </>
        }
      >
        <Stack spacing={2} my={2}>
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
            name="integration_key"
            autoComplete="text"
            label={t`Integration Key`}
            variant="outlined"
            fullWidth
            type="text"
            value={integrationKey}
            onChange={(e) => setIntegrationKey(e.target.value ?? '')}
          />
        </Stack>
      </Modal>
    </Stack>
  )
}
