import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { alpha, Autocomplete, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { EmailWithTextIcon, PowerIcon, SettingsIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { putWorkspaceNotificationAddMutation } from './putWorkspaceNotificationAdd.mutation'
import { WorkspaceSettingsConnectedServiceItemContainer } from './WorkspaceSettingsConnectedServiceItemContainer'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'

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
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'workspace-notifications',
          })
          modalRef.current?.(false)
        },
      },
    )
  }
  return hasPermission || isConnected ? (
    <WorkspaceSettingsConnectedServiceItemContainer icon={<EmailWithTextIcon color="primary.main" height={38} />}>
      {hasPermission ? (
        <>
          {isConnected ? <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="email" name="Email" /> : null}
          <LoadingButton
            loadingPosition={isLoading && !isConnected ? 'start' : undefined}
            startIcon={isConnected ? <SettingsIcon /> : <PowerIcon />}
            loading={isLoading}
            color={isConnected ? 'primary' : 'success'}
            variant="contained"
            sx={{ flexShrink: 0 }}
            onClick={() => modalRef.current?.(true)}
          >
            {isConnected ? <Trans>Configure</Trans> : <Trans>Connect</Trans>}
          </LoadingButton>
          {isConnected ? <WorkspaceSettingsTestService channel="email" isLoading={isLoading} /> : null}
          <Modal
            slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }}
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
                  loading={isPending}
                  variant="contained"
                  type="submit"
                  disabled={!name || !email.length}
                  startIcon={isConnected ? <SettingsIcon /> : <PowerIcon />}
                  color={isConnected ? 'primary' : 'success'}
                >
                  {isConnected ? <Trans>Update</Trans> : <Trans>Connect</Trans>}
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
                    slotProps={{
                      htmlInput: params.inputProps,
                      inputLabel: params.InputLabelProps,
                      input: {
                        ...params.InputProps,
                        sx: {
                          height: 'auto',
                        },
                      },
                    }}
                  />
                )}
                onChange={(_, values) => setEmail(values)}
              />
            </Stack>
          </Modal>
        </>
      ) : null}
    </WorkspaceSettingsConnectedServiceItemContainer>
  ) : null
}
