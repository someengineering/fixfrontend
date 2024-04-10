import { i18n, Messages } from '@lingui/core'
import dayjs from 'dayjs'
import { langs } from 'src/shared/constants'
import { getLocale } from 'src/shared/utils/localstorage'

const catalog = Object.entries(langs).reduce(
  (prev, [locale, { messages }]) => ({ ...prev, [locale]: messages }),
  {} as Record<string, Messages>,
)

const gotLocale = getLocale()
const currentLocale = gotLocale && catalog[gotLocale] ? gotLocale : langs['en-US'].locale

i18n.load(catalog)
i18n.activate(currentLocale)
dayjs.locale(currentLocale)

export { i18n }
