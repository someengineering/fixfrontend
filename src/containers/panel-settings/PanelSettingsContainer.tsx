import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { ContentRegion, PanelSettingsLayout } from 'src/shared/layouts/panel-settings-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { PanelSettingsRoutes } from './PanelSettingsRoutes'

export default function PanelSettingsContainer() {
  return (
    <PanelSettingsLayout>
      <ContentRegion>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <PanelSettingsRoutes />
          </Suspense>
        </NetworkErrorBoundary>
      </ContentRegion>
    </PanelSettingsLayout>
  )
}
