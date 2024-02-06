import { Trans, t } from '@lingui/macro'
import EmailIcon from '@mui/icons-material/Email'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { deleteWorkspaceNotificationEmailMutation } from './deleteWorkspaceNotificationEmail.mutation'
import { putWorkspaceNotificationAddEmailMutation } from './putWorkspaceNotificationAddEmail.mutation'

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
  const { selectedWorkspace } = useUserProfile()
  const { mutate, isPending } = useMutation({ mutationFn: putWorkspaceNotificationAddEmailMutation })
  const [typedEmail, setTypedEmail] = useState('')
  const [email, setEmail] = useState(defaultEmail ?? [])
  const [name, setName] = useState(defaultName ?? '')
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
      { workspaceId: selectedWorkspace?.id ?? '', email, name },
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
      <Stack width={150} direction="row" alignItems="center">
        <Box width={40}>
          <EmailIcon fontSize="large" />
        </Box>
        <Typography variant="h5">Email</Typography>
      </Stack>
      {isConnected ? (
        <>
          <WorkspaceSettingsDisconnectServiceModal
            isLoading={isLoading}
            mutationFn={deleteWorkspaceNotificationEmailMutation}
            name="Email"
          />
        </>
      ) : null}
      <LoadingButton
        loadingPosition={isLoading && !isConnected ? 'start' : undefined}
        startIcon={isConnected ? undefined : <PowerIcon />}
        loading={isLoading}
        variant="contained"
        sx={{ flexShrink: 0 }}
        onClick={() => modalRef.current?.(true)}
      >
        {isConnected ? <Trans>Configure</Trans> : <Trans>Connect</Trans>}
      </LoadingButton>
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
    </Stack>
  )
}