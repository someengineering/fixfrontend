import { i18n, Messages } from '@lingui/core'
import { I18nProvider, useLingui } from '@lingui/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
// eslint-disable-next-line no-restricted-imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { PropsWithChildren, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { SnackbarProvider } from 'src/core/snackbar'
import { Theme } from 'src/core/theme'
import { AbsoluteNavigateProvider } from 'src/shared/absolute-navigate'
import { env, langs } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { GTMProvider } from 'src/shared/google-tag-manager'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { getEnvironmentStr } from './getEnvironment'
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

const catalog = Object.entries(langs).reduce(
  (prev, [locale, { messages }]) => ({ ...prev, [locale]: messages }),
  {} as Record<string, Messages>,
)

const currentLocale = getLocale()

i18n.load(catalog)
i18n.activate(currentLocale && catalog[currentLocale] ? currentLocale : langs['en-US'].locale)

export const InnerI18nProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useLingui()
  const locale = i18n.locale as keyof typeof langs
  useEffect(() => {
    setLocale(i18n.locale)
  }, [i18n.locale])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={langs[locale]?.dayJsAdapterLocale ?? 'en'}>
      {children}
    </LocalizationProvider>
  )
}

export const Providers = ({ children }: PropsWithChildren) => {
  const [gtmId, setGtmId] = useState<string>()

  useEffect(() => {
    getEnvironmentStr()
      .then((envStr) => {
        setGtmId(envStr === 'prd' ? (env.gtmId = import.meta.env.VITE_GTM_PROD_ID) : (env.gtmId = import.meta.env.VITE_GTM_DEV_ID))
      })
      .catch(() => {})
  }, [])

  return import.meta.env.MODE === 'test' ? (
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
  ) : (
    <GTMProvider state={gtmId ? { id: gtmId } : undefined}>
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
    </GTMProvider>
  )
}
