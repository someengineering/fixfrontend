import { I18nProvider } from '@lingui/react'
import { PropsWithChildren } from 'react'
import { SnackbarProvider } from 'src/core/snackbar'
import { Theme } from 'src/core/theme'
import { InnerI18nProvider } from './InnerI18nProvider'
import { i18n } from './i18n'

// eslint-disable-next-line no-restricted-imports
import createCache from '@emotion/cache'
import { NonceProvider } from './NonceProvider'

export const BasicProviders = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => {
  const emotionCache = nonce
    ? createCache({
        key: `fix-nonce`,
        prepend: true,
        nonce,
      })
    : undefined

  return (
    <NonceProvider nonce={nonce}>
      <I18nProvider i18n={i18n}>
        <InnerI18nProvider>
          <Theme emotionCache={emotionCache}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </Theme>
        </InnerI18nProvider>
      </I18nProvider>
    </NonceProvider>
  )
}
