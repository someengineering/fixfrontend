import { i18n } from '@lingui/core'
import { I18nProvider, useLingui } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { PropsWithChildren, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { WebSocketEvents } from 'src/core/events'
import { SnackbarProvider } from 'src/core/snackbar'
import { Theme } from 'src/core/theme'
import { env, langs } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { getLocale, setLocale } from './localstorage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      retry: (failureCount, error) => {
        if ((((error as AxiosError)?.response?.status || (error as AxiosError)?.status) ?? 500) / 100 < 5) {
          return false
        }
        return failureCount < env.retryCount
      },
      staleTime: 1000 * 60 * 5,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

const catalog = langs.reduce((prev, lang) => ({ ...prev, [lang.locale]: lang.messages }), {})

i18n.load(catalog)
i18n.activate(getLocale() || langs[0].locale)

export const InnerI18nProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useLingui()
  useEffect(() => {
    setLocale(i18n.locale)
  }, [i18n.locale])
  return children
}

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <Theme>
      <I18nProvider i18n={i18n}>
        <InnerI18nProvider>
          <SnackbarProvider>
            <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <FullPageLoadingProvider>
                    <AuthGuard>
                      <WebSocketEvents>{children}</WebSocketEvents>
                    </AuthGuard>
                  </FullPageLoadingProvider>
                </BrowserRouter>
              </QueryClientProvider>
            </NetworkErrorBoundary>
          </SnackbarProvider>
        </InnerI18nProvider>
      </I18nProvider>
    </Theme>
  )
}
