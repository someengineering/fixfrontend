import { Trans, t } from '@lingui/macro'
import { Alert, Stack, TextField, TextFieldProps } from '@mui/material'
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
      {isSuccess ? (
        <Stack direction="row" pb={2}>
          <Alert variant="outlined" severity="warning">
            *{' '}
            <Trans>
              Your new email address will become active once you have verified it by clicking on the confirmation link we have sent to your
              inbox.
            </Trans>
          </Alert>
        </Stack>
      ) : undefined}
      <UserSettingsFormContentContainer
        title={<Trans>Email</Trans>}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        isPending={isPending}
        buttonDisabled={!email || email === data?.email}
        buttonContent={<Trans>Update Email</Trans>}
      >
        <TextField
          {...rest}
          size="small"
          error={!!error}
          helperText={formError}
          placeholder={data?.email}
          FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
          value={email}
          required
          id="email"
          fullWidth
          name="email"
          autoComplete="email"
          label={t`Email`}
          variant="outlined"
          type="email"
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value ?? '')}
        />
      </UserSettingsFormContentContainer>
    </>
  )
}
