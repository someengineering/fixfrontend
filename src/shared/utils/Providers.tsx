import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { messages as de } from 'src/locales/de/messages'
import { messages as en } from 'src/locales/en/messages'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { Loading } from 'src/shared/loading'

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
i18n.activate('de')

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Suspense fallback={<Loading />}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Suspense>
      </ErrorBoundary>
    </I18nProvider>
  )
}
