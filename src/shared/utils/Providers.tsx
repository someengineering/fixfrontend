import { i18n, Messages } from '@lingui/core'
import { I18nProvider, useLingui } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { PropsWithChildren, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { SnackbarProvider } from 'src/core/snackbar'
import { Theme } from 'src/core/theme'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env, langs } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { getLocale, setLocale } from './localstorage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
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

const catalog = langs.reduce((prev, lang) => ({ ...prev, [lang.locale]: lang.messages }), {} as Record<string, Messages>)

const currentLocale = getLocale()

i18n.load(catalog)
i18n.activate(currentLocale && catalog[currentLocale] ? currentLocale : langs[0].locale)

export const InnerI18nProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useLingui()
  useEffect(() => {
    setLocale(i18n.locale)
  }, [i18n.locale])
  return children
}

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <I18nProvider i18n={i18n}>
      <InnerI18nProvider>
        <Theme>
          <SnackbarProvider>
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
          </SnackbarProvider>
        </Theme>
      </InnerI18nProvider>
    </I18nProvider>
  )
}
