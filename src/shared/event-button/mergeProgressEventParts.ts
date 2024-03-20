import { CollectProgressEvent } from 'src/shared/types/server'

const mergeParts = (
  prevParts: CollectProgressEvent['data']['message']['parts'],
  newParts: CollectProgressEvent['data']['message']['parts'],
) =>
  prevParts.reduce((newParts, oldPart) => {
    const result = [...newParts]
    if (!newParts.find((part) => part.path?.join('/') === oldPart.path?.join('/'))) {
      result.push(oldPart)
    }
    return result
  }, newParts)

const mergeString = (prevStr: string, newStr: string) => [...new Set([...prevStr.split(', '), newStr])].join(', ')

export const mergeProgressEventParts = (prevEvent: CollectProgressEvent, newEvent: CollectProgressEvent): CollectProgressEvent => {
  return {
    ...prevEvent,
    id: mergeString(prevEvent.id, newEvent.id),
    publisher: mergeString(prevEvent.publisher, newEvent.publisher),
    at: newEvent.at,
    data: {
      task: mergeString(prevEvent.data.task, newEvent.data.task),
      workflow: mergeString(prevEvent.data.workflow, newEvent.data.workflow),
      message: {
        kind: mergeString(prevEvent.data.message.kind, newEvent.data.message.kind),
        name: mergeString(prevEvent.data.message.name, newEvent.data.message.name),
        parts: mergeParts(prevEvent.data.message.parts, newEvent.data.message.parts),
      },
    },
  }
}
