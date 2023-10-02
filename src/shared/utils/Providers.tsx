import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { AuthGuard } from 'src/core/auth'
import { Theme } from 'src/core/theme'
import { messages as de } from 'src/locales/de/messages'
import { messages as en } from 'src/locales/en/messages'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingProvider } from 'src/shared/loading'

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

const catalog = { en, de }

i18n.load(catalog)
i18n.activate('en')

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <Theme>
      <I18nProvider i18n={i18n}>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <FullPageLoadingProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <AuthGuard>{children}</AuthGuard>
              </BrowserRouter>
            </QueryClientProvider>
          </FullPageLoadingProvider>
        </ErrorBoundary>
      </I18nProvider>
    </Theme>
  )
}
