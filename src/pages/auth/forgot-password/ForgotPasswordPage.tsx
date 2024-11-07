import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Stack, styled, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { Location, useLocation, useSearchParams } from 'react-router-dom'
import { MailIcon, SendFilledIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { InternalLink } from 'src/shared/link-button'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { forgotPasswordMutation } from './forgotPassword.mutation'

const ForgotPasswordButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function ForgotPasswordPage() {
  const navigate = useAbsoluteNavigate()
  const { search, state } = useLocation() as Location<unknown>
  const {
    mutateAsync: forgotPassword,
    isPending: isForgotPasswordLoading,
    error,
  } = useMutation({
    mutationFn: forgotPasswordMutation,
    onSuccess: () => {
      const newSearch = getLocationSearchValues(search)
      newSearch.forget = 'true'
      navigate({ pathname: '/auth/login', search: mergeLocationSearchValues(newSearch) }, { state })
    },
  })
  const [email, setEmail] = useState('')
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
          {forgotPasswordError ? <Typography color="error.main">{forgotPasswordError}</Typography> : null}
          <ForgotPasswordButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!email}
            loading={isLoadingGeneric}
            loadingPosition={isLoadingGeneric ? 'start' : undefined}
            startIcon={isLoadingGeneric ? <SendFilledIcon /> : undefined}
          >
            <Trans>Forgot Password</Trans>
          </ForgotPasswordButton>
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
