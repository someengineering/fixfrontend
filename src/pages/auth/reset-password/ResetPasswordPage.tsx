import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Stack, styled, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { Location, useLocation, useSearchParams } from 'react-router-dom'
import { PasswordIcon } from 'src/assets/icons'
import { Navigate, useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { InternalLink } from 'src/shared/link-button'
import { PasswordTextField } from 'src/shared/password-text-field'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { resetPasswordMutation } from './resetPassword.mutation'

const ResetPasswordButton = styled(LoadingButton)({
  minHeight: 50,
})

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'RESET_PASSWORD_BAD_TOKEN':
      return t`The token that you sent is invalid or have been expired please try again`
    default:
      return error
  }
}

export default function ResetPasswordPage() {
  const { mutateAsync: resetPassword, isPending: isResetPasswordLoading, error } = useMutation({ mutationFn: resetPasswordMutation })
  const [getSearch] = useSearchParams()
  const [password, setPassword] = useState('')
  const { search, state } = useLocation() as Location<unknown>
  const navigate = useAbsoluteNavigate()
  const token = getSearch.get('token') ?? ''
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (token && password) {
      setIsLoading(true)
      resetPassword({ token, password })
        .then(() => {
          navigate(
            {
              search: mergeLocationSearchValues({ ...getLocationSearchValues(), reset: 'true' }),
              pathname: '/auth/login',
            },
            { state },
          )
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }
  const isLoadingGeneric = isLoading || isResetPasswordLoading
  let resetPasswordError =
    ((error as AxiosError)?.response?.data as { detail: string | { code: string; reason: string } })?.detail || undefined
  resetPasswordError = resetPasswordError
    ? typeof resetPasswordError === 'string'
      ? getErrorMessage(resetPasswordError)
      : resetPasswordError.reason
    : undefined
  return !token ? (
    <Navigate to={{ pathname: '/auth/login', search }} state={state} />
  ) : (
    <>
      <Stack
        component="form"
        spacing={3.75}
        width="100%"
        maxWidth={440}
        m="0 auto"
        alignItems="stretch"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Stack spacing={3}>
          <Typography variant="h3">
            <Trans>Reset password</Trans>
          </Typography>
          <Typography color={panelUI.uiThemePalette.text.sub}>
            <Trans>Please enter your account's email address and we'll send you a password reset link.</Trans>
          </Typography>
        </Stack>
        <Stack spacing={2.5}>
          <PasswordTextField
            required
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder={t`Password`}
            InputProps={{
              startAdornment: (
                <PasswordIcon width={24} height={24} fill={password ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined} />
              ),
            }}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
          {resetPasswordError && <Typography color="error.main">{resetPasswordError}</Typography>}
          <ResetPasswordButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!password || !token}
            loading={isLoadingGeneric}
            loadingPosition={isLoadingGeneric ? 'start' : undefined}
            startIcon={isLoadingGeneric ? <SendIcon /> : undefined}
          >
            <Trans>Reset Password</Trans>
          </ResetPasswordButton>
        </Stack>
        <Typography>
          <Trans>
            Already have an account?{' '}
            <InternalLink to={{ pathname: '/auth/login', search }} options={{ state }}>
              Back to Sign in
            </InternalLink>
          </Trans>
        </Typography>
      </Stack>
    </>
  )
}
