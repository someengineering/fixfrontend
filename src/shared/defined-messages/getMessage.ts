import { i18n } from '@lingui/core'
import { defineMessage } from '@lingui/macro'

const Messages = [
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
  defineMessage({
    message: 'Info',
  }),
  defineMessage({
    message: 'Passed',
  }),
]

export const getMessage = (id: string) => {
  return i18n._(Messages.find((i) => i.message === id)?.id ?? id)
}
