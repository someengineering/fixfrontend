import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Collapse, Divider, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, Suspense, useEffect, useState } from 'react'
import { Location, useLocation, useSearchParams } from 'react-router-dom'
import { MailIcon, PasswordIcon, SendFilledIcon } from 'src/assets/icons'
import { useSnackbar } from 'src/core/snackbar'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InternalLink } from 'src/shared/link-button'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { PasswordTextField } from 'src/shared/password-text-field'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button'
import { PostAuthRegisterErrorResponse } from 'src/shared/types/server'
import { getErrorDetailMessage } from 'src/shared/utils/getErrorMessage'
import { registerMutation } from './register.mutation'

const REGISTER_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

export default function RegisterPage() {
  const { mutateAsync: register, isPending: isRegisterLoading, error } = useMutation({ mutationFn: registerMutation })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [getSearch] = useSearchParams()
  const { search, state } = useLocation() as Location<unknown>
  const navigate = useAbsoluteNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      register({ email, password, redirectUrl: window.encodeURIComponent(getSearch.get('returnUrl') ?? panelUI.homePage) })
        .then(() => {
          navigate(
            {
              search: `${search ? `${search}&` : '?'}verify=true&email=${window.encodeURIComponent(email)}`,
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
  const isLoadingGeneric = isLoading || isRegisterLoading
  const registerErrorDetail = (error as AxiosError<PostAuthRegisterErrorResponse>)?.response?.data?.detail || undefined
  const registerError = registerErrorDetail
    ? typeof registerErrorDetail === 'string'
      ? getErrorDetailMessage(registerErrorDetail)
      : registerErrorDetail.reason
    : undefined
  const { showSnackbar, closeSnackbar } = useSnackbar()
  useEffect(() => {
    if (registerError) {
      let id: number
      showSnackbar(registerError, {
        alertColor: 'error',
        autoHideDuration: 2400,
      }).then((val) => (id = val))
      return () => {
        if (id) {
          closeSnackbar(id)
        }
      }
    }
  }, [showSnackbar, registerError, closeSnackbar])
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
            <Trans>Create an account</Trans>
          </Typography>
          <Typography variant="body2">
            <Trans>
              Already have an account?{' '}
              <InternalLink options={{ state }} to={{ pathname: '/auth/login', search }}>
                Sign in
              </InternalLink>
            </Trans>
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={2} pt={2.5}>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Suspense
              fallback={new Array(REGISTER_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON).fill('').map((_, i) => (
                <SocialMediaButtonSkeleton key={i} />
              ))}
            >
              <LoginSocialMedia isLoading={isLoadingGeneric} />
            </Suspense>
          </NetworkErrorBoundary>
        </Stack>
        <Divider>
          <Trans>or sign up with email</Trans>
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
                <MailIcon width={24} height={24} color={email ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined} />
              ),
            },
          }}
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value ?? '')}
        />
        <Collapse in={!!email}>
          <PasswordTextField
            required
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder={t`Password`}
            slotProps={{
              input: {
                startAdornment: (
                  <PasswordIcon width={24} height={24} color={email ? `${panelUI.uiThemePalette.text.darkGray} !important` : undefined} />
                ),
              },
            }}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
        </Collapse>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!password || !email}
          loading={isLoadingGeneric}
          loadingPosition={isLoadingGeneric ? 'start' : undefined}
          startIcon={isLoadingGeneric ? <SendFilledIcon /> : undefined}
        >
          <Trans>Sign up with email</Trans>
        </LoadingButton>
      </Stack>
    </>
  )
}
