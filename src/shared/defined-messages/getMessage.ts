import { i18n } from '@lingui/core'
import { defineMessage } from '@lingui/macro'

export const Messages = [
  defineMessage({
    message: 'Critical',
  }),
  defineMessage({
    message: 'High',
  }),
  defineMessage({
    message: 'Medium',
  }),
  defineMessage({
    message: 'Low',
  }),
]

export const getMessage = (id: string) => {
  return i18n._(Messages.find((i) => i.message === id)?.id ?? id)
}
