import { i18n, Messages } from '@lingui/core'
import { langs } from 'src/shared/constants'
import { getLocale } from 'src/shared/utils/localstorage'

const catalog = Object.entries(langs).reduce(
  (prev, [locale, { messages }]) => ({ ...prev, [locale]: messages }),
  {} as Record<string, Messages>,
)

const currentLocale = getLocale()

i18n.load(catalog)
i18n.activate(currentLocale && catalog[currentLocale] ? currentLocale : langs['en-US'].locale)

export { i18n }
