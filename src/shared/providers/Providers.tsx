import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider, FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { PostHogProvider } from 'src/shared/posthog'
import { BasicProviders } from './BasicProviders'
import { queryClient } from './queryClient'

export const Providers = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => {
  return (!env.isTest && !env.isLocal) || env.postHogTest ? (
    <BasicProviders nonce={nonce}>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AbsoluteNavigateProvider>
              <FullPageLoadingProvider>
                <Suspense fallback={<FullPageLoadingSuspenseFallback />}>
                  <PostHogProvider>
                    <AuthGuard>{children}</AuthGuard>
                  </PostHogProvider>
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
