import { I18nProvider } from '@lingui/react'
import { PropsWithChildren } from 'react'
import { SnackbarProvider } from 'src/core/snackbar'
import { Theme } from 'src/core/theme'
import { InnerI18nProvider } from './InnerI18nProvider'
import { i18n } from './i18n'

export const BasicProviders = ({ children }: PropsWithChildren) => {
  return (
    <I18nProvider i18n={i18n}>
      <InnerI18nProvider>
        <Theme>
          <SnackbarProvider>{children}</SnackbarProvider>
        </Theme>
      </InnerI18nProvider>
    </I18nProvider>
  )
}
