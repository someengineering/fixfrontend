import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { Loading } from 'src/shared/loading'
import { MainRoutes } from './MainRoutes'

export function MainContainer() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<Loading />}>
        <MainRoutes />
      </Suspense>
    </ErrorBoundary>
  )
}
