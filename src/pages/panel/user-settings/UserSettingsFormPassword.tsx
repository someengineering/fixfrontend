import { Trans, t } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { PasswordTextField, PasswordTextFieldProps } from 'src/shared/password-text-field'
import { PatchCurrentUserErrorResponse } from 'src/shared/types/server'
import { UserSettingsFormContentContainer } from './UserSettingsFormContentContainer'
import { patchUsersMeMutation } from './patchUsersMe.mutation'

type UserSettingsFormPasswordProps = Omit<
  PasswordTextFieldProps,
  'onChange' | 'fullWidth' | 'variant' | 'label' | 'autoComplete' | 'name' | 'id' | 'required' | 'value'
>

export const UserSettingsFormPassword = ({ ...rest }: UserSettingsFormPasswordProps) => {
  const { currentUser } = useUserProfile()
  const { mutateAsync, isPending, error } = useMutation({ mutationFn: patchUsersMeMutation })
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = () => {
    mutateAsync({ password, current_password: currentPassword })
  }

  const formError = error
    ? ((error as AxiosError<PatchCurrentUserErrorResponse>)?.response?.data?.detail?.reason ??
      t`Something went wrong please try again later.`)
    : undefined
  return (
    <>
      <UserSettingsFormContentContainer
        title={<Trans>Change password</Trans>}
        onSubmit={handleSubmit}
        isPending={isPending}
        buttonDisabled={!password || !currentPassword}
        buttonContent={<Trans>Change</Trans>}
        spacing={3}
      >
        <input id="hidden-email" name="email" autoComplete="email webauthn" hidden defaultValue={currentUser?.email} />
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" fontWeight={700} color="textSecondary">
            <Trans>Old Password</Trans>
          </Typography>
          <PasswordTextField
            {...rest}
            error={!!error}
            value={currentPassword}
            required
            id="current-password"
            name="current-password"
            autoComplete="current-password webauthn"
            variant="outlined"
            fullWidth
            onChange={(e) => setCurrentPassword(e.target.value ?? '')}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" fontWeight={700} color="textSecondary">
            <Trans>New Password</Trans>
          </Typography>
          <PasswordTextField
            {...rest}
            error={!!error}
            helperText={formError}
            value={password}
            required
            id="password"
            name="password"
            autoComplete="new-password"
            variant="outlined"
            fullWidth
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
        </Stack>
      </UserSettingsFormContentContainer>
    </>
  )
}
