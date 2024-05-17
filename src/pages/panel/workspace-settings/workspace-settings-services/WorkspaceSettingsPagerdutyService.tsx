import { Trans, t } from '@lingui/macro'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PowerIcon from '@mui/icons-material/Power'
import SettingsIcon from '@mui/icons-material/Settings'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { PagerdutyLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'
import { putWorkspaceNotificationAddMutation } from './putWorkspaceNotificationAdd.mutation'

interface WorkspaceSettingsPagerdutyServiceProps {
  isConnected?: boolean
  defaultName?: string
  isLoading?: boolean
}

export const WorkspaceSettingsPagerdutyService = ({ isConnected, defaultName, isLoading }: WorkspaceSettingsPagerdutyServiceProps) => {
  const theme = useTheme()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddMutation })
  const [integrationKey, setIntegrationKey] = useState('')
  const [name, setName] = useState(defaultName ?? 'Pagerduty Integration')
  useEffect(() => {
    if (defaultName) {
      setName(defaultName)
    }
  }, [defaultName])
  const queryClient = useQueryClient()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const handleConnect = () => {
    mutate(
      { workspaceId: selectedWorkspace?.id ?? '', integration_key: integrationKey, name, channel: 'pagerduty' },
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
  return hasPermission || isConnected ? (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent={{ xs: 'center', sm: 'start' }}
      minHeight={40}
      flexWrap="wrap"
      gap={2}
    >
      <Box width={150}>
        <PagerdutyLogo fill={theme.palette.common.black} width={100} />
      </Box>
      {hasPermission ? (
        <>
          {isConnected ? <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="pagerduty" name="PagerDuty" /> : null}
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
          {isConnected ? <WorkspaceSettingsTestService channel="pagerduty" isLoading={isLoading} /> : null}
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
                  For more information please visit{' '}
                  <Button
                    size="small"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://support.pagerduty.com/docs/services-and-integrations#section-events-API-v2"
                    endIcon={<OpenInNewIcon />}
                  >
                    PagerDuty Services and Integrations
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
        </>
      ) : null}
    </Stack>
  ) : null
}
