import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import { alpha, Button, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceInvite } from 'src/shared/types/server'
import { deleteWorkspaceInviteMutation } from './deleteWorkspaceInvite.mutation'

interface WorkspaceUsersSettingsPendingInvitationRowProps {
  workspaceInvite: WorkspaceInvite
}

export const WorkspaceUsersSettingsPendingInvitationRow = ({ workspaceInvite }: WorkspaceUsersSettingsPendingInvitationRowProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasDeletePermission = checkPermission('update')
  const queryClient = useQueryClient()

  const { mutate: deleteWorkspaceUser, isPending: deleteWorkspaceUserIsPending } = useMutation({
    mutationFn: deleteWorkspaceInviteMutation,
  })

  const handleDeleteModal = () => {
    if (showDeleteModalRef.current && hasDeletePermission) {
      showDeleteModalRef.current()
    }
  }

  const handleDelete = () => {
    if (selectedWorkspace?.id && hasDeletePermission) {
      deleteWorkspaceUser(
        { workspaceId: selectedWorkspace.id, inviteId: workspaceInvite.invite_id },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-invites', selectedWorkspace?.id], (oldData: WorkspaceInvite[]) => {
              const foundIndex = oldData.findIndex((item) => item.invite_id === workspaceInvite.invite_id)
              if (foundIndex > -1) {
                const newData = [...oldData]
                newData.splice(foundIndex, 1)
                return newData
              }
              return oldData
            })
          },
          onError: () => {
            queryClient.invalidateQueries({
              queryKey: ['workspace-users'],
            })
          },
          onSettled: () => {
            showDeleteModalRef.current?.(false)
          },
        },
      )
    }
  }

  return (
    <TableRow>
      <TableCell>{workspaceInvite.user_email || '-'}</TableCell>
      <TableCell>{workspaceInvite.expires_at ? new Date(workspaceInvite.expires_at).toLocaleString(locale) : '-'}</TableCell>
      {hasDeletePermission ? (
        <>
          <TableCell>
            {deleteWorkspaceUserIsPending ? (
              <IconButton aria-label={t`Delete`} disabled>
                <DeleteIcon />
              </IconButton>
            ) : (
              <Tooltip title={<Trans>Delete</Trans>} arrow>
                <IconButton aria-label={t`Delete`} color="error" onClick={handleDeleteModal}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </TableCell>
          <Modal
            slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }}
            title={<Trans>Are you sure?</Trans>}
            description={<Trans>Do you want to delete this invitation?</Trans>}
            openRef={showDeleteModalRef}
            actions={
              <>
                {deleteWorkspaceUserIsPending ? null : (
                  <Button color="primary" variant="contained" onClick={() => showDeleteModalRef.current?.(false)}>
                    <Trans>Cancel</Trans>
                  </Button>
                )}
                <LoadingButton
                  loadingPosition={deleteWorkspaceUserIsPending ? 'start' : undefined}
                  startIcon={<DeleteIcon />}
                  loading={deleteWorkspaceUserIsPending}
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
              <Trans>Email</Trans>: {workspaceInvite.user_email}
            </Typography>
            <Typography>
              <Trans>Expires</Trans>: {workspaceInvite.expires_at ? new Date(workspaceInvite.expires_at).toLocaleString(locale) : '-'}
            </Typography>
          </Modal>
        </>
      ) : null}
    </TableRow>
  )
}
