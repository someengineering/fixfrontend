import { useLingui } from '@lingui/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { PropsWithChildren, useEffect } from 'react'
import { langs } from 'src/shared/constants'
import { setLocale } from 'src/shared/utils/localstorage'

export const InnerI18nProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useLingui()
  const locale = i18n.locale as keyof typeof langs
  useEffect(() => {
    setLocale(i18n.locale)
    dayjs.locale(i18n.locale)
  }, [i18n.locale])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={langs[locale]?.dayJsAdapterLocale ?? 'en'}>
      {children}
    </LocalizationProvider>
  )
}
