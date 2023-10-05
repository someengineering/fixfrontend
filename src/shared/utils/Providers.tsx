import { i18n } from '@lingui/core'
import { I18nProvider, useLingui } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { Theme } from 'src/core/theme'
import { langs } from 'src/shared/constants'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider } from 'src/shared/loading'
import { getLocale, setLocale } from './localstorage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      retry: 5,
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
          <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <FullPageLoadingProvider>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <AuthGuard>{children}</AuthGuard>
                </BrowserRouter>
              </QueryClientProvider>
            </FullPageLoadingProvider>
          </ErrorBoundary>
        </InnerI18nProvider>
      </I18nProvider>
    </Theme>
  )
}
