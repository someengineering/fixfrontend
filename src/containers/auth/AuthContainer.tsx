import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Card, CardContent, CardHeader, Link, Typography } from '@mui/material'
import { Suspense } from 'react'
import { FixBetaLogo } from 'src/assets/icons'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { AuthLayout, BrandRegion, ContentRegion, FooterRegion, LeftRegion } from 'src/shared/layouts/auth-layout'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { AuthRoutes } from './AuthRoutes'

export default function AuthContainer() {
  useLingui()
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullPage />}>
        <AuthLayout>
          <LeftRegion>
            <Card elevation={24}>
              <CardHeader
                avatar={<PersonIcon />}
                title={
                  <Typography variant="h4">
                    <Trans>Connect your AWS account</Trans>
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  <Trans>
                    Login into the AWS account you want to secure. Deploy a CloudFormation stack that creates a new IAM role for FIX.
                  </Trans>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={24}>
              <CardHeader
                avatar={<VisibilityIcon />}
                title={
                  <Typography variant="h4">
                    <Trans>Secure read-only access</Trans>
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  <Trans>
                    Fix scans your infrastructure and resource configurations by using read-only API access. No agents required.
                  </Trans>
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={24}>
              <CardHeader
                avatar={<NotificationsIcon />}
                title={
                  <Typography variant="h4">
                    <Trans>A few minutes to first results</Trans>
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body1">
                  <Trans>
                    Get your top 5 recommendations to improve your security once the first scan is complete, usually within 10 minutes.
                  </Trans>
                </Typography>
              </CardContent>
            </Card>
          </LeftRegion>
          <BrandRegion>
            <FixBetaLogo width={128} height={128} />
          </BrandRegion>
          <ContentRegion>
            <AuthRoutes />
          </ContentRegion>
          <FooterRegion>
            <Typography variant="subtitle2">
              <Trans>
                <Link target="_blank" href={`${env.landingPageUrl}/privacy-policy`}>
                  Privacy policy
                </Link>{' '}
                |{' '}
                <Link target="_blank" href={`${env.landingPageUrl}/terms-and-conditions`}>
                  Terms and conditions
                </Link>
              </Trans>
            </Typography>
          </FooterRegion>
        </AuthLayout>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
