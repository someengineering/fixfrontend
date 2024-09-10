import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Collapse, Divider, Link, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, Suspense, useEffect, useRef, useState } from 'react'
import { Location, useLocation, useSearchParams } from 'react-router-dom'
import { MailIcon, PasswordIcon } from 'src/assets/icons'
import { allPermissions, maxPermissionNumber, useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InternalLink } from 'src/shared/link-button'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { PasswordTextField } from 'src/shared/password-text-field'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button'
import { PostAuthJWTLoginErrorResponse } from 'src/shared/types/server'
import { getErrorDetailMessage } from 'src/shared/utils/getErrorMessage'
import { getAuthData } from 'src/shared/utils/localstorage'
import { loginMutation } from './login.mutation'

const LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

export default function LoginPage() {
  const { mutateAsync: login, isPending: isLoginLoading, error } = useMutation({ mutationFn: loginMutation })
  const { setAuth } = useUserProfile()
  const [getSearch, setSearch] = useSearchParams()
  const lastSubmittedValueWithOtp = useRef(false)
  const [username, setUsername] = useState(getSearch.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [accessToOtp, setAccessToOtp] = useState(true)
  const [otp, setOtp] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation() as Location<unknown>
  const loginErrorDetail =
    (error as AxiosError<PostAuthJWTLoginErrorResponse>)?.response?.data?.detail ||
    (error as AxiosError<{ message?: string }>)?.response?.data?.message
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
  const isForget = getSearch.get('forget') === 'true'
  const loginError = needOtp && !lastSubmittedValueWithOtp.current ? undefined : loginErrorDetail || error || getSearch.get('error')
  const loginErrorText = loginError ? getErrorDetailMessage(loginError) : undefined
  const { showSnackbar, closeSnackbar } = useSnackbar()
  useEffect(() => {
    if (loginErrorText) {
      let id: number
      showSnackbar(loginErrorText, {
        alertColor: 'error',
        autoHideDuration: 2400,
      }).then((val) => (id = val))
      return () => {
        if (id) {
          closeSnackbar(id)
        }
      }
    }
  }, [showSnackbar, loginErrorText, closeSnackbar])
  useEffect(() => {
    if (isVerify) {
      setSearch((prev) => {
        prev.delete('verify')
        return prev
      })
      showSnackbar(
        <Trans>
          We have sent an email with a confirmation link to your email address. Please follow the link to activate your account.
        </Trans>,
        {
          alertColor: 'success',
          autoHideDuration: 2400,
        },
      )
    }
    if (isVerified) {
      setSearch((prev) => {
        prev.delete('verified')
        return prev
      })
      showSnackbar(<Trans>You have successfully verified your account.</Trans>, {
        alertColor: 'success',
        autoHideDuration: 2400,
      })
    }
    if (isForget) {
      setSearch((prev) => {
        prev.delete('forget')
        return prev
      })
      showSnackbar(
        <Trans>
          If this email address was used to create an account, instructions to reset your password will be sent to you. Please check your
          email.
        </Trans>,
        {
          alertColor: 'success',
          autoHideDuration: 2400,
        },
      )
    }
    if (needOtp) {
      showSnackbar(<Trans>Please enter your One-Time-Password or one of your Recovery code.</Trans>, {
        alertColor: 'info',
        autoHideDuration: 2400,
      })
    }
    if (isReset) {
      setSearch((prev) => {
        prev.delete('reset')
        return prev
      })
      showSnackbar(<Trans>You have successfully reset your password.</Trans>, {
        alertColor: 'success',
        autoHideDuration: 2400,
      })
    }
  }, [isForget, isReset, isVerified, isVerify, needOtp, setSearch, showSnackbar])
  return (
    <>
      <Stack
        component="form"
        spacing={2.5}
        width="100%"
        m="0 auto"
        alignItems="stretch"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Stack spacing={2}>
          <Typography variant="h3">
            <Trans>Sign in to Fix</Trans>
          </Typography>
          <Typography variant="body2">
            <Trans>
              New to Fix?{' '}
              <InternalLink options={{ state }} to={{ pathname: '/auth/register', search: window.location.search }}>
                Create an account
              </InternalLink>
            </Trans>
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={2} pt={2.5}>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Suspense
              fallback={new Array(LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON).fill('').map((_, i) => (
                <SocialMediaButtonSkeleton key={i} />
              ))}
            >
              <LoginSocialMedia isLoading={isLoadingGeneric} />
            </Suspense>
          </NetworkErrorBoundary>
        </Stack>
        <Divider>
          <Trans>or sign in with email</Trans>
        </Divider>
        <TextField
          required
          id="email"
          name="email"
          autoComplete="email"
          placeholder={t`name@example.com`}
          slotProps={{
            input: {
              startAdornment: (
                <MailIcon width={24} height={24} color={username ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined} />
              ),
            },
          }}
          variant="outlined"
          fullWidth
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value ?? '')}
          disabled={needOtp}
          error={!!error}
        />
        <Collapse in={!!username}>
          <Stack spacing={1.625} alignItems="end">
            <PasswordTextField
              required
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder={t`Password`}
              slotProps={{
                input: {
                  startAdornment: (
                    <PasswordIcon
                      width={24}
                      height={24}
                      color={username ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined}
                    />
                  ),
                },
              }}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value ?? '')}
              disabled={needOtp}
              error={!!loginError}
              helperText={loginError ? getErrorDetailMessage(loginError) : error ? getErrorDetailMessage(error) : undefined}
            />
            <InternalLink to={{ pathname: `/auth/forgot-password`, search: window.location.search }} options={{ state }}>
              <Trans>Forget your password?</Trans>
            </InternalLink>
          </Stack>
        </Collapse>
        {needOtp ? (
          <Collapse in={needOtp}>
            <Stack spacing={1.625} alignItems="end">
              {accessToOtp ? (
                <TextField
                  required
                  id="otp"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="OTP Code: 123456"
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
              ) : (
                <TextField
                  required
                  id="recovery_code"
                  name="recovery_code"
                  autoComplete="one-time-code"
                  placeholder="Recovery Code: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value ?? '')}
                />
              )}
              <Link onClick={() => setAccessToOtp(!accessToOtp)} sx={{ cursor: 'pointer' }}>
                {accessToOtp ? <Trans>Can't access OTP?</Trans> : <Trans>Use OTP instead</Trans>}
              </Link>
            </Stack>
          </Collapse>
        ) : null}
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!password || !username}
          loading={isLoadingGeneric}
          loadingPosition={isLoadingGeneric ? 'start' : undefined}
          startIcon={isLoadingGeneric ? <SendIcon /> : undefined}
          sx={{ py: 2, px: 4 }}
        >
          <Trans>Sign in with email</Trans>
        </LoadingButton>
      </Stack>
    </>
  )
}
