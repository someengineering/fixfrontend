import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { GTMProvider } from 'src/shared/google-tag-manager'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { getEnvironmentStr } from 'src/shared/utils/getEnvironment'
import { TrackJS } from 'trackjs'
import { BasicProviders } from './BasicProviders'
import { queryClient } from './queryClient'

const inLocalhost = window?.location?.host?.startsWith('localhost') || window?.location?.host?.startsWith('127.0.0.1') || false

export const Providers = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => {
  const [gtmId, setGtmId] = useState<string>()

  useEffect(() => {
    if (import.meta.env.MODE !== 'test' && !inLocalhost) {
      getEnvironmentStr()
        .then((envStr) => {
          env.aws_marketplace_url = envStr.aws_marketplace_url
          setGtmId(
            envStr.environment === 'prd' ? (env.gtmId = import.meta.env.VITE_GTM_PROD_ID) : (env.gtmId = import.meta.env.VITE_GTM_DEV_ID),
          )
        })
        .catch(() => {})
      if (!TrackJS.isInstalled() && import.meta.env.MODE !== 'development' && !inLocalhost) {
        TrackJS.install({
          token: import.meta.env.VITE_TRACKJS_TOKEN ?? '',
          application: 'fix',
        })
      }
    } else {
      env.gtmId = 'gtmId_test'
      env.aws_marketplace_url = 'https://aws_marketplace_url.test'
    }
  }, [])

  return import.meta.env.MODE === 'test' ? (
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
  ) : (
    <GTMProvider state={gtmId ? { id: gtmId, nonce } : undefined}>
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
    </GTMProvider>
  )
}
