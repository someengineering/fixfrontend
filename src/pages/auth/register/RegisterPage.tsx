import { t, Trans } from '@lingui/macro'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Divider, Grid, styled, TextField, Typography } from '@mui/material'
import { FormEvent, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoginSocialMedia } from 'src/shared/login-social-media'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button/SocialMediaButton.skeleton'

const REGISTER_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

const RegisterButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const username: string | undefined = e.currentTarget.username
    const password: string | undefined = e.currentTarget.password
    console.log({ username, password })
  }
  const handleClickHref = () => {
    setIsLoading(true)
  }
  return (
    <>
      <Typography variant="h3" color="primary" textAlign="justify" mb={2} maxWidth={550}>
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
          <Typography variant="h3" color="primary">
            <Trans>Register</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <TextField required id="username" label={t`Username`} variant="outlined" fullWidth type="email" />
        </Grid>
        <Grid item>
          <TextField required id="password" label={t`Password`} variant="outlined" fullWidth type="password" />
        </Grid>
        <Grid item>
          <RegisterButton
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            loading={isLoading}
            loadingPosition={isLoading ? 'start' : undefined}
            startIcon={isLoading ? <SendIcon /> : undefined}
          >
            <Trans>Sign up</Trans>
          </RegisterButton>
        </Grid>
        <Grid item>
          <Link to="/auth/login">
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
            <LoginSocialMedia isLoading={isLoading} onClick={handleClickHref} />
          </Suspense>
        </NetworkErrorBoundary>
      </Grid>
    </>
  )
}
