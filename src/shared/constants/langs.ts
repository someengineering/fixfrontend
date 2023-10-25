import GermanyIcon from 'flag-icons/flags/1x1/de.svg?react'
import USIcon from 'flag-icons/flags/1x1/us.svg?react'
import GermanyWideIcon from 'flag-icons/flags/4x3/de.svg?react'
import USWideIcon from 'flag-icons/flags/4x3/us.svg?react'
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
