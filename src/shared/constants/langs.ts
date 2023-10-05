import { ReactComponent as GermanyIcon } from 'flag-icons/flags/1x1/de.svg'
import { ReactComponent as USIcon } from 'flag-icons/flags/1x1/us.svg'
import { ReactComponent as GermanyWideIcon } from 'flag-icons/flags/4x3/de.svg'
import { ReactComponent as USWideIcon } from 'flag-icons/flags/4x3/us.svg'
import { messages as de_DE } from 'src/locales/de_DE/messages'
import { messages as en_US } from 'src/locales/en_US/messages'

export const langs = [
  {
    title: 'English',
    locale: 'en_US',
    IconWide: USWideIcon,
    Icon: USIcon,
    messages: en_US,
  },
  {
    title: 'German',
    locale: 'de_DE',
    IconWide: GermanyWideIcon,
    Icon: GermanyIcon,
    messages: de_DE,
  },
]
