import { Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { alpha, Button, MenuItem, MenuItemProps, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ComponentProps, FC, PropsWithChildren, ReactNode, useRef } from 'react'
import { DeleteIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { Modal } from 'src/shared/modal'
import { WorkspaceUser } from 'src/shared/types/server'
import { deleteWorkspaceUserMutation } from './deleteWorkspaceUser.mutation'

type DefaultButtonCompProps = PropsWithChildren<{ onClick?: () => void; disabled?: boolean }>
type DefaultMenuItemCompProps = Omit<MenuItemProps, 'onclick' | 'disabled' | 'children'> & DefaultButtonCompProps

interface DeleteInvitedExternalUserMenuItemProps<ButtonCompPropsType extends DefaultButtonCompProps> {
  workspaceUserIds: string[]
  deleteConfirmText?: ReactNode
  ButtonComp?: FC<ButtonCompPropsType>
  buttonProps?: ButtonCompPropsType
  onClose?: (success?: boolean) => void
}

export function DeleteInvitedExternalUserMenuItem<ButtonCompPropsType extends DefaultButtonCompProps = DefaultMenuItemCompProps>({
  workspaceUserIds,
  deleteConfirmText = <Trans>Do you want to delete this users?</Trans>,
  ButtonComp = MenuItem as FC<ButtonCompPropsType>,
  buttonProps,
  onClose,
}: DeleteInvitedExternalUserMenuItemProps<ButtonCompPropsType>) {
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasRemoveUserPermission = checkPermission('removeFrom')
  const queryClient = useQueryClient()

  const { mutate: deleteWorkspaceUser, isPending: deleteWorkspaceUserIsPending } = useMutation({
    mutationFn: deleteWorkspaceUserMutation,
  })

  const handleDeleteModal = () => {
    buttonProps?.onClick?.()
    if (showDeleteModalRef.current && hasRemoveUserPermission) {
      showDeleteModalRef.current()
    }
  }

  const handleDeleteOneUser = async (id: string) => {
    if (selectedWorkspace?.id && hasRemoveUserPermission) {
      return await deleteWorkspaceUser({ workspaceId: selectedWorkspace.id, userId: id })
    }
  }

  const handleClose = (success?: boolean) => {
    onClose?.(success)
    showDeleteModalRef.current?.(false)
  }

  const handleDelete = () => {
    Promise.all(workspaceUserIds.map(handleDeleteOneUser))
      .then(() => {
        queryClient.setQueryData(['workspace-users', selectedWorkspace?.id], (oldData: WorkspaceUser[]) =>
          oldData.filter((item) => !workspaceUserIds.includes(item.id)),
        )
      })
      .catch(() =>
        queryClient.invalidateQueries({
          queryKey: ['workspace-users'],
        }),
      )
      .finally(() => handleClose(true))
  }

  const children = buttonProps?.children ?? <Trans>Delete</Trans>

  return hasRemoveUserPermission ? (
    <>
      <ButtonComp
        {...(buttonProps as ComponentProps<typeof ButtonComp>)}
        onClick={handleDeleteModal}
        disabled={deleteWorkspaceUserIsPending}
      >
        {children}
      </ButtonComp>
      <Modal openRef={showDeleteModalRef} slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }} onClose={handleClose}>
        <Stack p={3.75} spacing={3} alignItems="center">
          <Stack
            alignItems="center"
            justifyContent="center"
            width={48}
            height={48}
            borderRadius="12px"
            bgcolor={({ palette }) => alpha(palette.error.main, 0.15)}
          >
            <DeleteIcon color="error.main" width={32} height={32} />
          </Stack>
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h4">
              <Trans>Are you sure?</Trans>
            </Typography>
            <Typography color="textSecondary">{deleteConfirmText}</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            {deleteWorkspaceUserIsPending ? null : (
              <Button color="primary" variant="outlined" onClick={() => handleClose()}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton loading={deleteWorkspaceUserIsPending} color="error" variant="outlined" onClick={handleDelete}>
              {children}
            </LoadingButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  ) : null
}
