import { Trans } from '@lingui/macro'
import { Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FixLogo } from 'src/assets/icons'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { BottomRegion, ContentRegion, LogoRegion, PanelLayout } from 'src/shared/layouts/panel-layout'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { PanelRoutes } from './PanelRoutes'

export default function PanelContainer() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback />}>
        <PanelLayout>
          <LogoRegion>
            <FixLogo width={46} height={46} />
          </LogoRegion>
          <ContentRegion>
            <PanelRoutes />
          </ContentRegion>
          <BottomRegion>
            <Typography variant="subtitle2">
              <Trans>© 2023 Some Engineering Inc. All rights reserved.</Trans>
            </Typography>
          </BottomRegion>
        </PanelLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
