import type { Messages } from '@lingui/core'
import { messages as deDEMessagesAny } from './de-DE/messages'
import { messages as enUSMessagesAny } from './en-US/messages'

const deDEMessages = deDEMessagesAny as Messages
const enUSMessages = enUSMessagesAny as Messages

export { deDEMessages, enUSMessages }
