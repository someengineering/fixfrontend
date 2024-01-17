import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Divider, Grid, styled, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, Suspense, useState } from 'react'
import { Link, Location, useLocation, useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button'
import { loginMutation } from './login.mutation'

const LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

const LoginButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function LoginPage() {
  const { mutateAsync: login, isPending: isLoginLoading, error } = useMutation({ mutationFn: loginMutation })
  const { setAuth } = useUserProfile()
  const [getSearch] = useSearchParams()
  const [username, setUsername] = useState(getSearch.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { search, state } = useLocation() as Location<unknown>
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username && password) {
      setIsLoading(true)
      login({ username, password })
        .then(() => {
          const returnUrl = getSearch.get('returnUrl') ?? '/'
          setAuth(
            {
              isAuthenticated: true,
              workspaces: [],
            },
            returnUrl,
          )
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }
  const handleClickHref = () => {
    setIsLoading(true)
  }
  const isLoadingGeneric = isLoading || isLoginLoading
  const isVerify = getSearch.get('verify') === 'true'
  const isVerified = getSearch.get('verified') === 'true'
  const loginError = ((error as AxiosError)?.response?.data as { detail: string })?.detail || getSearch.get('error')
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
            <Trans>Log in</Trans>
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
            value={username}
            onChange={(e) => setUsername(e.target.value ?? '')}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            id="password"
            name="password"
            autoComplete="current-password"
            label={t`Password`}
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
        </Grid>
        {loginError ? (
          <Grid item>
            <Typography color="error.main">{loginError}</Typography>
          </Grid>
        ) : isVerified || isVerify ? (
          <Grid item>
            {isVerify ? (
              <Typography color="info.main">
                <Trans>
                  We have sent an email with a confirmation link to your email address. Please follow the link to activate your account.
                </Trans>
              </Typography>
            ) : (
              <Typography color="success.main">
                <Trans>You have successfully verified your account.</Trans>
              </Typography>
            )}
          </Grid>
        ) : null}
        <Grid item>
          <LoginButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!password || !username}
            loading={isLoadingGeneric}
            loadingPosition={isLoadingGeneric ? 'start' : undefined}
            startIcon={isLoadingGeneric ? <SendIcon /> : undefined}
          >
            <Trans>Log in</Trans>
          </LoginButton>
        </Grid>
        <Grid item>
          <Link to={{ pathname: '/auth/register', search }} state={state}>
            <Trans>Don't have an account? Click here to Sign up.</Trans>
          </Link>
        </Grid>
        <Grid item>
          <Divider>
            <Trans>Or</Trans>
          </Divider>
        </Grid>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={new Array(LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON).fill('').map((_, i) => (
              <Grid item key={i}>
                <SocialMediaButtonSkeleton />
              </Grid>
            ))}
          >
            <LoginSocialMedia isLoading={isLoadingGeneric} onClick={handleClickHref} />
          </Suspense>
        </NetworkErrorBoundary>
      </Grid>
    </>
  )
}
