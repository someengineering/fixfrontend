import { useLingui } from '@lingui/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
// eslint-disable-next-line no-restricted-imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { PropsWithChildren, useEffect } from 'react'
import { langs } from 'src/shared/constants'
import { setLocale } from 'src/shared/utils/localstorage'

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
