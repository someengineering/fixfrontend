import { Trans, t } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { Modal } from 'src/shared/modal'
import { GetWorkspaceSettingsResponse } from 'src/shared/types/server'
import { postWorkspaceInviteMutation } from './postWorkspaceInvite.mutation'

interface InviteExternalUserProps {
  preInvite?: GetWorkspaceSettingsResponse
}

export const InviteExternalUser = ({ preInvite }: InviteExternalUserProps) => {
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const [name, setName] = useState(preInvite?.name ?? '')
  const [email, setEmail] = useState(preInvite?.name ?? '')
  const [roles, setRoles] = useState<string[]>([])
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const { mutate: postWorkspaceInvite, isPending: postWorkspaceInviteIsPending } = useMutation({
    mutationFn: postWorkspaceInviteMutation,
    onSuccess: () => {
      void showSnackbar(t`Successfully invited ${email}`, { severity: 'success' })
    },
    onError: () => {
      void showSnackbar(t`An error occurred, please try again later.`, { severity: 'error' })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['workspace-invites'],
      })
      showModalRef.current?.(false)
    },
  })

  const handleAction = () => {
    postWorkspaceInvite({ email, name, roles, workspaceId: selectedWorkspace?.id ?? '' })
  }
  return (
    <>
      <Button
        variant={preInvite ? 'text' : 'contained'}
        size={preInvite ? 'small' : undefined}
        onClick={() => showModalRef.current?.(true)}
      >
        {preInvite ? <Trans>Invite</Trans> : <Trans>Invite External User</Trans>}
      </Button>
      <Modal
        openRef={showModalRef}
        actions={
          <LoadingButton
            loadingPosition={postWorkspaceInviteIsPending ? 'end' : undefined}
            endIcon={<SendIcon />}
            loading={postWorkspaceInviteIsPending}
            color="primary"
            variant="contained"
            onClick={handleAction}
          >
            <Trans>Send Invite</Trans>
          </LoadingButton>
        }
        title={<Trans>Invite External User</Trans>}
      >
        <Stack spacing={2}>
          <Stack direction="row">
            <Stack width={60} justifyContent="center">
              <Typography>
                <Trans>Name</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <TextField size="small" onChange={(e) => setName(e.target.value)} value={name} placeholder={t`Name`} />
            </Stack>
          </Stack>
          <Stack direction="row">
            <Stack width={60} justifyContent="center">
              <Typography>
                <Trans>Email</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <TextField size="small" onChange={(e) => setEmail(e.target.value)} value={email} placeholder={t`Email`} />
            </Stack>
          </Stack>
          <Stack direction="row">
            <Stack width={60} justifyContent="center">
              <Typography>
                <Trans>Roles</Trans>:
              </Typography>
            </Stack>
            <Stack flexGrow={1}>
              <Autocomplete
                value={roles}
                multiple
                getOptionLabel={(option) => option}
                onChange={(_, values) => setRoles(values.map((value) => value.toLowerCase().replace(' ', '_')))}
                options={['Member', 'Admin', 'Billing Admin']}
                size="small"
                renderInput={(props) => <TextField {...props} placeholder={t`Roles`} />}
              />
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </>
  )
}
