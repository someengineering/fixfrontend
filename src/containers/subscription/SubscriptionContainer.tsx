import { useLingui } from '@lingui/react'
import { Suspense } from 'react'
import { FixLogo } from 'src/assets/icons'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { BrandRegion, ContentRegion, SubscriptionLayout } from 'src/shared/layouts/subscription-layout'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { SubscriptionRoutes } from './SubscriptionRoutes'

export default function SubscriptionContainer() {
  useLingui()
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullPage />}>
        <SubscriptionLayout>
          <BrandRegion>
            <FixLogo width={46} height={46} />
          </BrandRegion>
          <ContentRegion>
            <SubscriptionRoutes />
          </ContentRegion>
        </SubscriptionLayout>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
