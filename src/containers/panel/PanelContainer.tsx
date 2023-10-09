import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Typography } from '@mui/material'
import { Suspense } from 'react'
import { FixLogo } from 'src/assets/icons'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { BottomRegion, ContentRegion, LogoRegion, PanelLayout } from 'src/shared/layouts/panel-layout'
import { FullPageLoadingSuspenseFallback, LoadingSuspenseFallback } from 'src/shared/loading'
import { PanelRoutes } from './PanelRoutes'

export default function PanelContainer() {
  useLingui()
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullpage />}>
        <PanelLayout>
          <LogoRegion>
            <FixLogo width={46} height={46} />
          </LogoRegion>
          <ContentRegion>
            <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
              <Suspense fallback={<LoadingSuspenseFallback />}>
                <PanelRoutes />
              </Suspense>
            </NetworkErrorBoundary>
          </ContentRegion>
          <BottomRegion>
            <Typography variant="subtitle2">
              <Trans>© 2023 Some Engineering Inc. All rights reserved.</Trans>
            </Typography>
          </BottomRegion>
        </PanelLayout>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
