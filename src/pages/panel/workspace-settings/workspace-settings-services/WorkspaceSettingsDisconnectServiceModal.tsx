import { Trans } from '@lingui/macro'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { NotificationChannel } from 'src/shared/types/server'
import { deleteWorkspaceNotificationMutation } from './deleteWorkspaceNotification.mutation'

interface WorkspaceSettingsDisconnectServiceModalProps {
  channel: NotificationChannel
  name: string
  isLoading?: boolean
}

export const WorkspaceSettingsDisconnectServiceModal = ({ name, channel, isLoading }: WorkspaceSettingsDisconnectServiceModalProps) => {
  const { selectedWorkspace } = useUserProfile()
  const disconnectModalRef = useRef<(show?: boolean | undefined) => void>()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceNotificationMutation,
    onSettled: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'workspace-notifications',
      })
      disconnectModalRef.current?.(false)
    },
  })
  const handleDisconnect = () => {
    if (selectedWorkspace?.id) {
      mutate({ workspaceId: selectedWorkspace.id, channel })
    }
  }

  return (
    <>
      <LoadingButton
        loadingPosition={isPending ? 'start' : undefined}
        startIcon={<PowerOffIcon />}
        loading={isLoading}
        variant="contained"
        color="error"
        sx={{ flexShrink: 0 }}
        onClick={() => disconnectModalRef.current?.(true)}
      >
        <Trans>Disconnect</Trans>
      </LoadingButton>
      <Modal
        title={<Trans>Disconnect Service</Trans>}
        openRef={disconnectModalRef}
        actions={
          <>
            {isPending ? null : (
              <Button color="primary" variant="contained" onClick={() => disconnectModalRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton
              loadingPosition={isPending ? 'start' : undefined}
              startIcon={<PowerOffIcon />}
              loading={isPending}
              color="error"
              variant="outlined"
              onClick={handleDisconnect}
            >
              <Trans>Disconnect</Trans>
            </LoadingButton>
          </>
        }
      >
        <Typography>
          <Trans>Are you sure you want to disconnect {name}?</Trans>
        </Typography>
      </Modal>
    </>
  )
}
