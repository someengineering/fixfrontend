import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Grid, styled, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { Link, Location, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { PasswordTextField } from 'src/shared/password-text-field'
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
          const email = getSearch.get('email') ?? ''
          navigate(
            {
              search: search
                ? `${search}&reset=true&email=${window.encodeURIComponent(email)}`
                : `?reset=true&email=${window.encodeURIComponent(email)}`,
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
    <Navigate
      to={{
        pathname: '/auth/login',
        search,
      }}
    />
  ) : (
    <>
      <Grid
        component="form"
        container
        rowSpacing={3}
        maxWidth={350}
        m="0 auto"
        alignItems="stretch"
        direction="column"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Grid item>
          <Typography variant="h3" color="primary.main">
            <Trans>Reset Password</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <PasswordTextField
            required
            id="password"
            name="password"
            autoComplete="new-password"
            label={t`Password`}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
        </Grid>
        {resetPasswordError && (
          <Grid item>
            <Typography color="error.main">{resetPasswordError}</Typography>
          </Grid>
        )}
        <Grid item>
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
        </Grid>
        <Grid item>
          <Link to={{ pathname: '/auth/login', search }} state={state}>
            <Trans>Already have an account? Click here to Log in.</Trans>
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
