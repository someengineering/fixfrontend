import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Divider, Grid, styled, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, Suspense, useState } from 'react'
import { Link, Location, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button'
import { registerMutation } from './register.mutation'

const REGISTER_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

const RegisterButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function RegisterPage() {
  const { mutateAsync: register, isPending: isRegisterLoading, error } = useMutation({ mutationFn: registerMutation })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [getSearch] = useSearchParams()
  const { search, state } = useLocation() as Location<unknown>
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      register({ email, password, redirectUrl: window.encodeURIComponent(getSearch.get('returnUrl') ?? '/') })
        .then(() => {
          navigate(
            {
              search: search
                ? `${search}&verify=true&email=${window.encodeURIComponent(email)}`
                : `?verify=true&email=${window.encodeURIComponent(email)}`,
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
  const handleClickHref = () => {
    setIsLoading(true)
  }
  const isLoadingGeneric = isLoading || isRegisterLoading
  const registerError = ((error as AxiosError)?.response?.data as { detail: string })?.detail
  return (
    <>
      <Typography variant="h3" color="primary.main" textAlign="justify" mb={2} maxWidth={550}>
        <Trans>Simple and affordable visibility into your cloud security posture.</Trans>
      </Typography>
      <Typography variant="h6" color="grey.700" textAlign="justify" mb={4} maxWidth={550}>
        <Trans>
          Fix is an open-source Wiz alternative for cloud infrastructure security. Take control of cloud risks with an asset inventory,
          compliance scans, and remediation workflows.
        </Trans>
      </Typography>
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
            <Trans>Register</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            id="email"
            label={t`Email`}
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value ?? '')}
          />
        </Grid>
        <Grid item>
          <TextField
            required
            id="password"
            label={t`Password`}
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value ?? '')}
          />
        </Grid>
        {registerError && (
          <Grid item>
            <Typography color="error.main">{registerError}</Typography>
          </Grid>
        )}
        <Grid item>
          <RegisterButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!password || !email}
            loading={isLoadingGeneric}
            loadingPosition={isLoadingGeneric ? 'start' : undefined}
            startIcon={isLoadingGeneric ? <SendIcon /> : undefined}
          >
            <Trans>Sign up</Trans>
          </RegisterButton>
        </Grid>
        <Grid item>
          <Link to={{ pathname: '/auth/login', search }} state={state}>
            <Trans>Already have an account? Click here to Log in.</Trans>
          </Link>
        </Grid>
        <Grid item>
          <Divider>
            <Trans>Or</Trans>
          </Divider>
        </Grid>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={new Array(REGISTER_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON).fill('').map((_, i) => (
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
