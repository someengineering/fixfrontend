import { Trans, t } from '@lingui/macro'
import { Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { GetWorkspaceSettingsResponse } from 'src/shared/types/server'
import { InviteExternalUserForm } from './InviteExternalUserForm'
import { postWorkspaceInviteMutation } from './postWorkspaceInvite.mutation'

interface InviteExternalUserProps {
  preInvite?: GetWorkspaceSettingsResponse
}

export const InviteExternalUser = ({ preInvite }: InviteExternalUserProps) => {
  const [open, setOpen] = useState(false)
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasInvitePermission = checkPermission('inviteTo')
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const { mutate: postWorkspaceInvite, isPending: postWorkspaceInviteIsPending } = useMutation({
    mutationFn: postWorkspaceInviteMutation,
    onSuccess: (data) => {
      showSnackbar(t`Successfully invited ${data.user_email}`, { alertColor: 'success' })
    },
    onError: () => {
      showSnackbar(t`An error occurred, please try again later.`, { alertColor: 'error' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-invites'],
      })
      setOpen(false)
    },
  })

  const handleAction = (name: string, email: string, roles: string[]) => {
    if (hasInvitePermission) {
      postWorkspaceInvite({ email, name, roles, workspaceId: selectedWorkspace?.id ?? '' })
    }
  }
  return hasInvitePermission ? (
    <>
      <Button variant={preInvite ? 'text' : 'contained'} size={preInvite ? 'small' : undefined} onClick={() => setOpen(true)}>
        {preInvite ? <Trans>Invite</Trans> : <Trans>Invite External User</Trans>}
      </Button>
      <InviteExternalUserForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAction}
        isPending={postWorkspaceInviteIsPending}
        defaultName={preInvite?.name}
        defaultEmail={preInvite?.name}
      />
    </>
  ) : null
}
