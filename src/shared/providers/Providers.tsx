import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { PosthogProvider } from 'src/shared/posthog'
import { getEnvironmentStr } from 'src/shared/utils/getEnvironment'
import { BasicProviders } from './BasicProviders'
import { queryClient } from './queryClient'

const inLocalhost = window?.location?.host?.indexOf?.('localhost') === 0 || window?.location?.host?.indexOf?.('127.0.0.1') === 0 || false

export const Providers = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => {
  const [posthogProjectApiKey, setPosthogProjectApiKey] = useState<string>()

  useEffect(() => {
    if (import.meta.env.MODE !== 'test' && !inLocalhost) {
      getEnvironmentStr()
        .then((envStr) => {
          env.isLocal = inLocalhost
          env.isProd = envStr.environment === 'prd'
          env.aws_marketplace_url = envStr.aws_marketplace_url
          setPosthogProjectApiKey(
            envStr.environment === 'prd'
              ? import.meta.env.VITE_POSTHOG_PROD_PROJECT_API_KEY
              : import.meta.env.VITE_POSTHOG_DEV_PROJECT_API_KEY,
          )
        })
        .catch(() => {})
    } else {
      env.isLocal = inLocalhost
      env.isProd = false
      env.aws_marketplace_url = 'https://aws_marketplace_url.test'
      setPosthogProjectApiKey(import.meta.env.VITE_POSTHOG_DEV_PROJECT_API_KEY)
    }
  }, [])

  return (
    <PosthogProvider projectApiKey={posthogProjectApiKey}>
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
    </PosthogProvider>
  )
}
