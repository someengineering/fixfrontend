import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Alert, Divider, Grid, styled, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, Suspense, useRef, useState } from 'react'
import { Link, Location, useLocation, useSearchParams } from 'react-router-dom'
import { allPermissions, maxPermissionNumber, useUserProfile } from 'src/core/auth'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { PasswordTextField } from 'src/shared/password-text-field'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button'
import { PostAuthJWTLoginErrorResponse } from 'src/shared/types/server'
import { getErrorDetailMessage } from 'src/shared/utils/getErrorMessage'
import { getAuthData } from 'src/shared/utils/localstorage'
import { loginMutation } from './login.mutation'

const LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

const LoginButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function LoginPage() {
  const { mutateAsync: login, isPending: isLoginLoading, error } = useMutation({ mutationFn: loginMutation })
  const { setAuth } = useUserProfile()
  const [getSearch] = useSearchParams()
  const lastSubmittedValueWithOtp = useRef(false)
  const [username, setUsername] = useState(getSearch.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { search, state } = useLocation() as Location<unknown>
  const loginErrorDetail = (error as AxiosError<PostAuthJWTLoginErrorResponse>)?.response?.data?.detail
  const needOtp = loginErrorDetail === 'OTP_NOT_PROVIDED_OR_INVALID'
  const handleSubmit = (e?: FormEvent<HTMLFormElement>, newOtp?: string) => {
    e?.preventDefault()
    if (username && password) {
      const theOtp = newOtp || otp
      setIsLoading(true)
      const values = { username, password, otp: theOtp, recoveryCode }
      lastSubmittedValueWithOtp.current = needOtp
      login(values)
        .then(() => {
          const workspaceId = getAuthData()?.selectedWorkspaceId
          const returnUrl = getSearch.get('returnUrl') || panelUI.homePage
          setAuth(
            {
              isAuthenticated: true,
              workspaces: [],
              selectedWorkspace: {
                id: returnUrl.split('#')[1] || (workspaceId as string),
                members: [],
                name: '',
                owners: [],
                slug: '',
                created_at: new Date().toISOString(),
                on_hold_since: null,
                trial_end_days: null,
                move_to_free_acknowledged_at: new Date().toISOString(),
                tier: 'Free',
                permissions: allPermissions,
                user_has_access: false,
                user_permissions: maxPermissionNumber,
              },
            },
            returnUrl,
          )
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }
  const isLoadingGeneric = isLoading || isLoginLoading
  const isVerify = getSearch.get('verify') === 'true'
  const isVerified = getSearch.get('verified') === 'true'
  const isReset = getSearch.get('reset') === 'true'
  const loginError = needOtp && !lastSubmittedValueWithOtp.current ? undefined : loginErrorDetail || getSearch.get('error')
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
            disabled={needOtp}
          />
        </Grid>
        <Grid item>
          <PasswordTextField
            required
            id="password"
            name="password"
            autoComplete="current-password"
            label={t`Password`}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
            disabled={needOtp}
          />
        </Grid>
        {needOtp ? (
          <>
            <Grid item>
              <TextField
                required
                id="otp"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                label={t`OTP Code`}
                placeholder="123456"
                variant="outlined"
                fullWidth
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value ?? ''
                  setOtp(value)
                  if (value.length === 6) {
                    handleSubmit(undefined, value)
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Divider>
                <Trans>Or</Trans>
              </Divider>
            </Grid>
            <Grid item>
              <TextField
                required
                id="recovery_code"
                name="recovery_code"
                autoComplete="one-time-code"
                label={t`Recovery Code`}
                placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                variant="outlined"
                fullWidth
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value ?? '')}
              />
            </Grid>
          </>
        ) : null}
        {loginError ? (
          <Grid item>
            <Alert severity="error">{getErrorDetailMessage(loginError)}</Alert>
          </Grid>
        ) : needOtp ? (
          <Grid item>
            <Typography color="info.main">
              <Trans>Please enter your One-Time-Password or one of your Recovery code.</Trans>
            </Typography>
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
        ) : isReset ? (
          <Grid item>
            <Typography color="success.main">
              <Trans>You have successfully reset your password.</Trans>
            </Typography>
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
          <Link to={{ pathname: `/auth/forgot-password`, search }} state={state}>
            <Trans>Forget your password? Click here to reset your password.</Trans>
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
            <LoginSocialMedia isLoading={isLoadingGeneric} />
          </Suspense>
        </NetworkErrorBoundary>
      </Grid>
    </>
  )
}
