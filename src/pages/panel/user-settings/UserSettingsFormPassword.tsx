import { Trans, t } from '@lingui/macro'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { PasswordTextField, PasswordTextFieldProps } from 'src/shared/password-text-field'
import { PatchCurrentUserErrorResponse } from 'src/shared/types/server'
import { UserSettingsFormContentContainer } from './UserSettingsFormContentContainer'
import { patchUsersMeMutation } from './patchUsersMe.mutation'

type UserSettingsFormPasswordProps = Omit<
  PasswordTextFieldProps,
  'onChange' | 'fullWidth' | 'variant' | 'label' | 'autoComplete' | 'name' | 'id' | 'required' | 'value'
>

export const UserSettingsFormPassword = ({ ...rest }: UserSettingsFormPasswordProps) => {
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
        title={<Trans>New Password</Trans>}
        onSubmit={handleSubmit}
        isPending={isPending}
        buttonDisabled={!password || !currentPassword}
        buttonContent={<Trans>Update Password</Trans>}
      >
        <PasswordTextField
          {...rest}
          size="small"
          error={!!error}
          value={currentPassword}
          required
          id="current-password"
          name="current-password"
          autoComplete="current-password webauthn"
          label={t`Current Password`}
          variant="outlined"
          fullWidth
          onChange={(e) => setCurrentPassword(e.target.value ?? '')}
        />
        <PasswordTextField
          {...rest}
          size="small"
          error={!!error}
          helperText={formError}
          value={password}
          required
          id="password"
          name="password"
          autoComplete="new-password"
          label={t`New Password`}
          variant="outlined"
          fullWidth
          onChange={(e) => setPassword(e.target.value ?? '')}
        />
      </UserSettingsFormContentContainer>
    </>
  )
}
