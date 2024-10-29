import { Trans } from '@lingui/macro'
import { ListItemText, MenuItem } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { GetWorkspaceUsersResponse, WorkspaceUser } from 'src/shared/types/server'
import { UserRole } from 'src/shared/types/server-shared'
import { InviteExternalUserForm } from './InviteExternalUserForm'
import { putWorkspaceRolesMutation } from './putWorkspaceRoles.mutation'
import { roleOptions } from './roleOptions'

interface EditInvitedExternalUserMenuItemProps {
  workspaceUser: WorkspaceUser
  onClose?: () => void
}

const roles = roleOptions.map(({ role }) => role)

export const EditInvitedExternalUserMenuItem = ({ workspaceUser, onClose }: EditInvitedExternalUserMenuItemProps) => {
  const [open, setOpen] = useState(false)
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasInvitePermission = checkPermission('inviteTo')
  const queryClient = useQueryClient()

  const { mutate: changeRole, isPending: changeRoleIsPending } = useMutation({
    mutationFn: putWorkspaceRolesMutation,
    onSuccess: ({ admin, billing_admin, member, owner }) => {
      queryClient.setQueryData(['workspace-users', selectedWorkspace?.id], (oldData: GetWorkspaceUsersResponse) => {
        const foundIndex = oldData.findIndex((item) => item.id === workspaceUser.id)
        if (foundIndex > -1) {
          const newData = [...oldData]
          newData[foundIndex] = {
            ...newData[foundIndex],
            roles: { admin, billing_admin, member, owner },
          }
          return newData
        }
        return oldData
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-users'] })
      queryClient.invalidateQueries({ queryKey: ['workspace-roles'] })
      setOpen(false)
    },
  })

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const handleAction = (_name: string, email: string, roles: string[]) => {
    if (hasInvitePermission) {
      const userRoles = roles.reduce((rolesObj, role) => ({ ...rolesObj, [role]: roles.includes(role) }), {} as UserRole)
      changeRole({
        ...userRoles,
        user_id: workspaceUser.id,
        user_email: email,
        workspaceId: selectedWorkspace?.id ?? '',
      })
    }
  }
  return hasInvitePermission ? (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <ListItemText>
          <Trans>Edit</Trans>
        </ListItemText>
      </MenuItem>
      <InviteExternalUserForm
        open={open}
        onClose={handleClose}
        onSubmit={handleAction}
        isPending={changeRoleIsPending}
        defaultName={workspaceUser.name}
        defaultEmail={workspaceUser.email}
        defaultRoles={roles.filter((role) => workspaceUser.roles[role])}
        isEdit
      />
    </>
  ) : null
}
