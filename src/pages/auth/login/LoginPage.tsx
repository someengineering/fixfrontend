import { t, Trans } from '@lingui/macro'
import { Button, Divider, Grid, styled, TextField, Typography } from '@mui/material'
import { FormEvent, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { SocialMediaButtonSkeleton } from 'src/shared/social-media-button/SocialMediaButton.skeleton'
import { LoginSocialMedia } from './LoginSocialMedia'

const LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON = 2

const LoginButton = styled(Button)({
  minHeight: 50,
})

export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const username: string | undefined = e.currentTarget.username
    const password: string | undefined = e.currentTarget.password
    console.log({ username, password })
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
            <Trans>Login</Trans>
          </Typography>
        </Grid>
        <Grid item>
          <TextField required id="username" label={t`Username`} variant="outlined" fullWidth type="email" />
        </Grid>
        <Grid item>
          <TextField required id="password" label={t`Password`} variant="outlined" fullWidth type="password" />
        </Grid>
        <Grid item>
          <LoginButton type="submit" variant="contained" fullWidth size="large">
            <Trans>Login</Trans>
          </LoginButton>
        </Grid>
        <Grid item>
          <Divider>
            <Trans>Or</Trans>
          </Divider>
        </Grid>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={new Array(LOGIN_SUSPENSE_NUMBER_OF_SOCIAL_MEDIA_BUTTON).fill('').map((_, i) => (
              <Grid item key={i}>
                <SocialMediaButtonSkeleton />
              </Grid>
            ))}
          >
            <LoginSocialMedia />
          </Suspense>
        </ErrorBoundary>
      </Grid>
    </>
  )
}
