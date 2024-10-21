import { Trans, t } from '@lingui/macro'
import { TextField, TextFieldProps, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { UserSettingsFormContentContainer } from './UserSettingsFormContentContainer'
import { getUsersMeQuery } from './getUsersMe.query'
import { patchUsersMeMutation } from './patchUsersMe.mutation'

type UserSettingsFormEmailProps = Omit<
  TextFieldProps,
  'onChange' | 'type' | 'variant' | 'label' | 'autoComplete' | 'name' | 'fullWidth' | 'id' | 'required' | 'value'
>

export const UserSettingsFormEmail = ({ ...rest }: UserSettingsFormEmailProps) => {
  const { currentUser } = useUserProfile()
  const { data, isLoading } = useQuery({
    queryKey: ['users-me', currentUser?.id],
    queryFn: getUsersMeQuery,
  })
  const { mutateAsync, isPending, error, isSuccess } = useMutation({ mutationFn: patchUsersMeMutation })
  const [email, setEmail] = useState('')
  useEffect(() => {
    if (data?.email) {
      setEmail(data.email)
    }
  }, [data])
  const handleSubmit = () => {
    mutateAsync({ email })
  }
  const formError = error
    ? (((error as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`)
    : undefined
  return (
    <>
      <UserSettingsFormContentContainer
        title={<Trans>Update email</Trans>}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        isPending={isPending}
        buttonDisabled={!email || email === data?.email}
        buttonContent={<Trans>Update</Trans>}
      >
        <TextField
          {...rest}
          error={!!error}
          helperText={
            formError ??
            (isSuccess ? (
              <Typography variant="subtitle1" color="success.main">
                <Trans>
                  Your new email address will become active once you have verified it by clicking on the confirmation link we have sent to
                  your inbox.
                </Trans>
              </Typography>
            ) : null)
          }
          placeholder={data?.email}
          value={email}
          required
          id="email"
          fullWidth
          name="email"
          autoComplete="email"
          variant="outlined"
          type="email"
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value ?? '')}
        />
      </UserSettingsFormContentContainer>
    </>
  )
}
