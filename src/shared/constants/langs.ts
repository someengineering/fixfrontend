import { deDE as muiDeDE, enUS as muiEnUS } from '@mui/material/locale'
import { deDE as muiDataGridPremiumDeDE, enUS as muiDataGridPremiumEnUS } from '@mui/x-data-grid-premium'
import { deDE as muiDatePickerDeDE, enUS as muiDatePickerEnUS } from '@mui/x-date-pickers'
import 'dayjs/locale/de'
import 'dayjs/locale/en'
import GermanyIcon from 'flag-icons/flags/1x1/de.svg?react'
import USIcon from 'flag-icons/flags/1x1/us.svg?react'
import GermanyWideIcon from 'flag-icons/flags/4x3/de.svg?react'
import USWideIcon from 'flag-icons/flags/4x3/us.svg?react'
import { deDEMessages, enUSMessages } from 'src/locales'

export const langs = {
  'en-US': {
    title: 'English',
    locale: 'en-US',
    dayJsAdapterLocale: 'en',
    IconWide: USWideIcon,
    Icon: USIcon,
    messages: enUSMessages,
    muiLocale: [muiEnUS, muiDatePickerEnUS, muiDataGridPremiumEnUS],
  },
  'de-DE': {
    title: 'Deutsch',
    locale: 'de-DE',
    dayJsAdapterLocale: 'de',
    IconWide: GermanyWideIcon,
    Icon: GermanyIcon,
    messages: deDEMessages,
    muiLocale: [muiDeDE, muiDatePickerDeDE, muiDataGridPremiumDeDE],
  },
}
