import { Trans, t } from '@lingui/macro'
import EmailIcon from '@mui/icons-material/Email'
import PowerIcon from '@mui/icons-material/Power'
import SettingsIcon from '@mui/icons-material/Settings'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'
import { putWorkspaceNotificationAddMutation } from './putWorkspaceNotificationAdd.mutation'

interface WorkspaceSettingsEmailServiceProps {
  isConnected?: boolean
  defaultName?: string
  defaultEmail?: string[]
  isLoading?: boolean
}

export const WorkspaceSettingsEmailService = ({
  isConnected,
  defaultEmail,
  defaultName,
  isLoading,
}: WorkspaceSettingsEmailServiceProps) => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddMutation })
  const [typedEmail, setTypedEmail] = useState('')
  const [email, setEmail] = useState(defaultEmail ?? [])
  const [name, setName] = useState(defaultName ?? 'Email Integration')
  useEffect(() => {
    if (defaultName) {
      setName(defaultName)
    }
    if (defaultEmail) {
      setEmail(defaultEmail)
    }
  }, [defaultName, defaultEmail])
  const queryClient = useQueryClient()
  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const handleConnect = () => {
    mutate(
      { workspaceId: selectedWorkspace?.id ?? '', email, name, channel: 'email' },
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
      <Stack width={150} direction="row" alignItems="center">
        <Box width={40}>
          <EmailIcon fontSize="large" color="primary" />
        </Box>
        <Typography variant="h4" color="primary.main">
          Email
        </Typography>
      </Stack>
      {hasPermission ? (
        <>
          {isConnected ? <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="email" name="Email" /> : null}
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
          {isConnected ? <WorkspaceSettingsTestService channel="email" isLoading={isLoading} /> : null}
          <Modal
            onSubmit={handleConnect}
            openRef={modalRef}
            title={<Trans>Setting Up Email Notifications</Trans>}
            description={
              <Trans>
                <Typography>
                  To ensure you receive timely alerts and notifications directly to your email, we require your email address.
                  <br />
                  Please note that it is possible to define multiple email addresses.
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
                  disabled={!name || !email.length}
                >
                  <Trans>Connect</Trans>
                </LoadingButton>
              </>
            }
          >
            <Stack spacing={2} py={2}>
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
              <Autocomplete
                value={email}
                multiple
                options={email.includes(typedEmail) ? email : [typedEmail, ...email]}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="email"
                    autoComplete="email"
                    label={t`Email`}
                    variant="outlined"
                    type="email"
                    value={typedEmail}
                    onChange={(e) => setTypedEmail(e.target.value)}
                  />
                )}
                onChange={(_, values) => setEmail(values)}
              />
            </Stack>
          </Modal>
        </>
      ) : null}
    </Stack>
  ) : null
}
