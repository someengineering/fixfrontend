import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Link, Stack, Typography } from '@mui/material'
import { Suspense } from 'react'
import { FixLogo } from 'src/assets/icons'
import { env, panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { AuthLayout, BrandRegion, ContentRegion, FooterRegion, SideRegion } from 'src/shared/layouts/auth-layout'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { AuthCarousel } from './AuthCarousel'
import { AuthRoutes } from './AuthRoutes'
import IsoComp from './iso.svg?react'

export default function AuthContainer() {
  useLingui()
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullPage />}>
        <AuthLayout>
          <SideRegion>
            <AuthCarousel />
          </SideRegion>
          <BrandRegion>
            <FixLogo color="primary.main" />
          </BrandRegion>
          <ContentRegion>
            <AuthRoutes />
          </ContentRegion>
          <FooterRegion>
            <Stack spacing={5} flexGrow={{ xs: 1, sm: 0 }} justifyContent={{ xs: 'space-between', sm: 'start' }}>
              <Typography variant="subtitle2">
                <Trans>
                  By signing in, you agree to our{' '}
                  <Link target="_blank" href={`${env.landingPageUrl}/privacy-policy`} variant="subtitle2" color="common.black">
                    Privacy policy
                  </Link>{' '}
                  and{' '}
                  <Link target="_blank" href={`${env.landingPageUrl}/terms-and-conditions`} variant="subtitle2" color="common.black">
                    Terms & Conditions.
                  </Link>
                </Trans>
              </Typography>
              <IsoComp fill={panelUI.uiThemePalette.text.darkGray} />
            </Stack>
          </FooterRegion>
        </AuthLayout>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
