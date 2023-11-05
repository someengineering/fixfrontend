import {messages as deDEMessagesAny} from './de_DE/messages'
import {messages as enUSMessagesAny} from './en_US/messages'
import type { Messages } from '@lingui/core';

const deDEMessages = deDEMessagesAny as Messages
const enUSMessages = enUSMessagesAny as Messages

export {
  deDEMessages,
  enUSMessages
}