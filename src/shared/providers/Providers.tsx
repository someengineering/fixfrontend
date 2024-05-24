import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider, FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { PosthogProvider } from 'src/shared/posthog'
import { BasicProviders } from './BasicProviders'
import { queryClient } from './queryClient'

export const Providers = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => {
  return import.meta.env.MODE !== 'test' && !env.isLocal ? (
    <BasicProviders nonce={nonce}>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AbsoluteNavigateProvider>
              <FullPageLoadingProvider>
                <Suspense fallback={<FullPageLoadingSuspenseFallback />}>
                  <PosthogProvider>
                    <AuthGuard>{children}</AuthGuard>
                  </PosthogProvider>
                </Suspense>
              </FullPageLoadingProvider>
            </AbsoluteNavigateProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </NetworkErrorBoundary>
    </BasicProviders>
  ) : (
    <BasicProviders nonce={nonce}>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AbsoluteNavigateProvider>
              <FullPageLoadingProvider>
                <AuthGuard>{children}</AuthGuard>
              </FullPageLoadingProvider>
            </AbsoluteNavigateProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </NetworkErrorBoundary>
    </BasicProviders>
  )
}
