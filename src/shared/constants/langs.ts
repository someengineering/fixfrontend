import GermanyIcon from 'flag-icons/flags/1x1/de.svg?react'
import USIcon from 'flag-icons/flags/1x1/us.svg?react'
import GermanyWideIcon from 'flag-icons/flags/4x3/de.svg?react'
import USWideIcon from 'flag-icons/flags/4x3/us.svg?react'
import { deDEMessages, enUSMessages } from 'src/locales'

export const langs = [
  {
    title: 'English',
    locale: 'en_US',
    IconWide: USWideIcon,
    Icon: USIcon,
    messages: enUSMessages,
  },
  {
    title: 'German',
    locale: 'de_DE',
    IconWide: GermanyWideIcon,
    Icon: GermanyIcon,
    messages: deDEMessages,
  },
]
