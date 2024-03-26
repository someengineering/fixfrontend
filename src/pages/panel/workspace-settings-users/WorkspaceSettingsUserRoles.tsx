import { Trans, t } from '@lingui/macro'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import { Autocomplete, CircularProgress, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { GetWorkspaceUsersResponse, UserRole } from 'src/shared/types/server'
import { putWorkspaceRolesMutation } from './putWorkspaceRoles.mutation'
import { workspaceSettingsUserRoleToString } from './workspaceSettingsUserRoleToString'

// roles.push(t`Owner`)
// }
// if (role.admin) {
//   roles.push(t`Admin`)
// }
// if (role.billing_admin) {
//   roles.push(t`Billing Admin`)
// }
// if (role.member) {
//   roles.push(t`Member`)
// }

const autocompleteOptions = ['admin' as const, 'owner' as const, 'billing_admin' as const, 'member' as const]
type AutocompleteOptions = typeof autocompleteOptions

const userRolesToAutocompleteOptions = (role: UserRole) => {
  const result = [] as AutocompleteOptions
  if (role.admin) {
    result.push('admin')
  }
  if (role.billing_admin) {
    result.push('billing_admin')
  }
  if (role.member) {
    result.push('member')
  }
  if (role.owner) {
    result.push('owner')
  }
  return result
}

const autocompleteOptionsToUserRoles = (values: AutocompleteOptions) => {
  return {
    admin: values.includes('admin'),
    billing_admin: values.includes('billing_admin'),
    member: values.includes('member'),
    owner: values.includes('owner'),
  } as UserRole
}

const getAutocompleteLabelFromOption = (label: AutocompleteOptions[number]) => {
  switch (label) {
    case 'admin':
      return t`Admin`
    case 'owner':
      return t`Owner`
    case 'billing_admin':
      return t`Billing Admin`
    case 'member':
      return t`Member`
  }
}

export const WorkspaceSettingsUserRoles = ({ role, userId }: { role: UserRole; userId: string }) => {
  const { selectedWorkspace } = useUserProfile()
  const [rolesValues, setValues] = useState(userRolesToAutocompleteOptions(role))
  const [isEdit, setIsEdit] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: changeRole, isPending: changeRoleIsPending } = useMutation({
    mutationFn: putWorkspaceRolesMutation,
    onSuccess: ({ admin, billing_admin, member, owner }) => {
      queryClient.setQueryData(['workspace-users', selectedWorkspace?.id], (oldData: GetWorkspaceUsersResponse) => {
        const foundIndex = oldData.findIndex((item) => item.id === userId)
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
      void queryClient.invalidateQueries({ queryKey: ['workspace-users'] })
      void queryClient.invalidateQueries({ queryKey: ['workspace-roles'] })
      setIsEdit(false)
    },
  })

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    changeRole({ workspaceId: selectedWorkspace?.id ?? '', ...autocompleteOptionsToUserRoles(rolesValues), user_id: userId })
  }

  const handleEdit = () => {
    setIsEdit(true)
    setValues(userRolesToAutocompleteOptions(role))
  }

  return isEdit ? (
    <Stack
      component="form"
      name={`change-role-for-${userId}`}
      onSubmit={handleSubmit}
      direction="row"
      alignItems="center"
      spacing={1}
      minWidth={200}
    >
      <Autocomplete
        value={rolesValues}
        multiple
        getOptionLabel={getAutocompleteLabelFromOption}
        options={autocompleteOptions}
        onChange={(_, option) => setValues(option)}
        disabled={changeRoleIsPending}
        sx={{ flexGrow: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            variant="standard"
            margin="none"
            inputProps={{ ...params.inputProps, style: { ...params.inputProps.style, padding: '0' } }}
          />
        )}
      />

      {changeRoleIsPending ? (
        <CircularProgress size={20} />
      ) : (
        <Tooltip title={<Trans>Submit</Trans>}>
          <IconButton aria-label={t`Submit`} color="success" type="submit">
            <SendIcon />
          </IconButton>
        </Tooltip>
      )}
      {changeRoleIsPending ? (
        <IconButton disabled aria-label={t`Cancel`}>
          <CancelIcon />
        </IconButton>
      ) : (
        <Tooltip title={<Trans>Cancel</Trans>}>
          <IconButton aria-label={t`Cancel`} color="error" onClick={() => setIsEdit(false)}>
            <CancelIcon />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  ) : (
    <Stack direction="row" alignItems="center" spacing={1} minWidth={200}>
      <Typography flexGrow={1} onClick={handleEdit} sx={{ cursor: 'pointer' }}>
        {workspaceSettingsUserRoleToString(role)}
      </Typography>
      <Tooltip title={<Trans>Edit</Trans>}>
        <IconButton aria-label={t`Edit`} color="primary" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
