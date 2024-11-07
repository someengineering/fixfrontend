import { Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Button, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { DeleteIcon, PowerOffIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { GetOAuthAssociatesResponse } from 'src/shared/types/server'
import { deleteOAuthAssociateMutation } from './deleteOAuthAssociate.mutation'

interface UserSettingsSocialNetworkDisconnectButtonProps {
  providerId: string
  email: string | null
  name: string
}

export const UserSettingsSocialNetworkDisconnectButton = ({ providerId, email, name }: UserSettingsSocialNetworkDisconnectButtonProps) => {
  const { currentUser } = useUserProfile()
  const { mutate, isPending } = useMutation({ mutationFn: deleteOAuthAssociateMutation })
  const queryClient = useQueryClient()

  const openRef = useRef<(show?: boolean | undefined) => void>()

  const handleDeleteModal = () => {
    if (openRef.current) {
      openRef.current()
    }
  }

  const handleDelete = () => {
    mutate(providerId, {
      onSuccess: () => {
        queryClient.setQueryData(
          ['oauth-associate', window.encodeURIComponent(window.location.pathname + window.location.search), currentUser?.id],
          (oldData: GetOAuthAssociatesResponse) => {
            const foundIndex = oldData.findIndex((item) => item.account_id === providerId)
            if (foundIndex > -1) {
              const newData = [...oldData]
              newData.splice(foundIndex, 1)
              return newData
            }
            return oldData
          },
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'oauth-associate',
        })
        openRef.current?.(false)
      },
    })
  }

  return (
    <>
      <Button color="error" variant="outlined" startIcon={<PowerOffIcon color="error.main" />} onClick={handleDeleteModal}>
        <Trans>Disconnect</Trans>
      </Button>
      <Modal
        title={<Trans>Delete Provider</Trans>}
        openRef={openRef}
        actions={
          <>
            {isPending ? null : (
              <Button color="primary" variant="contained" onClick={() => openRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton
              loadingPosition={isPending ? 'start' : undefined}
              startIcon={<DeleteIcon />}
              loading={isPending}
              color="error"
              variant="outlined"
              onClick={handleDelete}
            >
              <Trans>Delete</Trans>
            </LoadingButton>
          </>
        }
      >
        <Typography>
          <Trans>
            Are you sure you want to remove the {name} account {email ? `(${email})` : ''}?
          </Trans>
        </Typography>
      </Modal>
    </>
  )
}
