import { Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { Modal } from 'src/shared/modal'
import { WorkspaceUser } from 'src/shared/types/server'
import { deleteWorkspaceUserMutation } from './deleteWorkspaceUser.mutation'
import { WorkspaceSettingsUserRoles } from './WorkspaceSettingsUserRoles'

interface DeleteInvitedExternalUserMenuItemProps {
  workspaceUser: WorkspaceUser
  onClick?: () => void
}

export const DeleteInvitedExternalUserMenuItem = ({ workspaceUser, onClick }: DeleteInvitedExternalUserMenuItemProps) => {
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasRemoveUserPermission = checkPermission('removeFrom')
  const queryClient = useQueryClient()

  const { mutate: deleteWorkspaceUser, isPending: deleteWorkspaceUserIsPending } = useMutation({
    mutationFn: deleteWorkspaceUserMutation,
  })

  const handleDeleteModal = () => {
    if (showDeleteModalRef.current && hasRemoveUserPermission) {
      showDeleteModalRef.current()
    }
  }

  const handleDelete = () => {
    if (selectedWorkspace?.id && hasRemoveUserPermission) {
      deleteWorkspaceUser(
        { workspaceId: selectedWorkspace.id, userId: workspaceUser.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-users', selectedWorkspace?.id], (oldData: WorkspaceUser[]) => {
              const foundIndex = oldData.findIndex((item) => item.id === workspaceUser.id)
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

  return hasRemoveUserPermission ? (
    <>
      <MenuItem
        onClick={() => {
          onClick?.()
          handleDeleteModal()
        }}
        disabled={deleteWorkspaceUserIsPending}
      >
        <Trans>Delete</Trans>
      </MenuItem>
      <Modal
        title={<Trans>Are you sure?</Trans>}
        description={
          <>
            <Trans>Do you want to delete this user?</Trans>
          </>
        }
        openRef={showDeleteModalRef}
        actions={
          <>
            {deleteWorkspaceUserIsPending ? null : (
              <Button color="primary" variant="outlined" onClick={() => showDeleteModalRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton loading={deleteWorkspaceUserIsPending} color="error" variant="outlined" onClick={handleDelete}>
              <Trans>Delete</Trans>
            </LoadingButton>
          </>
        }
      >
        <Stack p={3} spacing={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              <Trans>Source</Trans>
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {workspaceUser.sources.map(({ source }, i) => (
                <Box borderRadius="50%" key={i}>
                  <CloudAvatar cloud={source} />
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={500}>
                <Trans>Name</Trans>
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {workspaceUser.name}
              </Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={500}>
                <Trans>Email</Trans>
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {workspaceUser.email}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={500}>
              <Trans>Roles</Trans>
            </Typography>
            <WorkspaceSettingsUserRoles workspaceUser={workspaceUser} />
          </Stack>
        </Stack>
      </Modal>
    </>
  ) : null
}
