import { useLingui } from '@lingui/react'
import { Suspense } from 'react'
import { FixLogo } from 'src/assets/icons'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { AuthLayout, BrandRegion, ContentRegion } from 'src/shared/layouts/auth-layout'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { AuthRoutes } from './AuthRoutes'

export default function AuthContainer() {
  useLingui()
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullpage />}>
        <AuthLayout>
          <BrandRegion>
            <FixLogo width={128} height={128} />
          </BrandRegion>
          <ContentRegion>
            <AuthRoutes />
          </ContentRegion>
        </AuthLayout>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
