import { deDE as muiDeDE, enUS as muiEnUS } from '@mui/material/locale'
import { deDE as muiDataGridDeDE, enUS as muiDataGridEnUS } from '@mui/x-data-grid'
import { deDE as muiDatePickerDeDE, enUS as muiDatePickerEnUS } from '@mui/x-date-pickers'
import GermanyIcon from 'flag-icons/flags/1x1/de.svg?react'
import USIcon from 'flag-icons/flags/1x1/us.svg?react'
import GermanyWideIcon from 'flag-icons/flags/4x3/de.svg?react'
import USWideIcon from 'flag-icons/flags/4x3/us.svg?react'
import { deDEMessages, enUSMessages } from 'src/locales'

export const langs = [
  {
    title: 'English',
    locale: 'en-US',
    IconWide: USWideIcon,
    Icon: USIcon,
    messages: enUSMessages,
    muiLocale: [muiEnUS, muiDatePickerEnUS, muiDataGridEnUS],
  },
  {
    title: 'Deutsch',
    locale: 'de-DE',
    IconWide: GermanyWideIcon,
    Icon: GermanyIcon,
    messages: deDEMessages,
    muiLocale: [muiDeDE, muiDatePickerDeDE, muiDataGridDeDE],
  },
]
