import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Grid, styled, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { Link, Location, useLocation, useSearchParams } from 'react-router-dom'
import { forgotPasswordMutation } from './forgotPassword.mutation'

const ForgotPasswordButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function ForgotPasswordPage() {
  const {
    mutateAsync: forgotPassword,
    isPending: isForgotPasswordLoading,
    isSuccess: isForgotPasswordSuccess,
    error,
  } = useMutation({ mutationFn: forgotPasswordMutation })
  const [email, setEmail] = useState('')
  const { search, state } = useLocation() as Location<unknown>
  const [getSearch] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      forgotPassword({ email, redirectUrl: window.encodeURIComponent(getSearch.get('returnUrl') ?? '/') }).finally(() =>
        setIsLoading(false),
      )
    }
  }
  const isLoadingGeneric = isLoading || isForgotPasswordLoading
  const forgotPasswordError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
  return (
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
            <Trans>Forgot Password</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            id="email"
            name="email"
            autoComplete="email"
            label={t`Email`}
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value ?? '')}
          />
        </Grid>
        {forgotPasswordError ? (
          <Grid item>
            <Typography color="error.main">{forgotPasswordError}</Typography>
          </Grid>
        ) : isForgotPasswordSuccess ? (
          <Grid item>
            <Typography color="success.main">
              <Trans>
                An email has been sent to your inbox with a 'Reset Password' button. Please check your email and click on it to reset your
                password.
              </Trans>
            </Typography>
          </Grid>
        ) : null}
        <Grid item>
          <ForgotPasswordButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!email}
            loading={isLoadingGeneric}
            loadingPosition={isLoadingGeneric ? 'start' : undefined}
            startIcon={isLoadingGeneric ? <SendIcon /> : undefined}
          >
            <Trans>Forgot Password</Trans>
          </ForgotPasswordButton>
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
