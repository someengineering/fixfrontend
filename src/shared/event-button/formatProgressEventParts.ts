import { CollectProgressEvent } from 'src/shared/types/server'

export interface FormattedProgressEventParts {
  name: string
  current: number
  total: number
  path: string
  detail?: FormattedProgressEventParts[]
}

const createPart = (prevParts: FormattedProgressEventParts[], currentPath: string = '', prevPath: string = '') => {
  const currentFullPath = `${prevPath}>${currentPath}`
  const foundPart = prevParts.find((part) => part.path === currentFullPath)
  if (foundPart) {
    return foundPart
  } else {
    const partNumberIndex =
      prevParts.push({
        name: currentPath,
        path: currentFullPath,
        current: 0,
        total: 0,
      }) - 1
    return prevParts[partNumberIndex]
  }
}

const populatePart = (
  prevParts: FormattedProgressEventParts[],
  currentPart: CollectProgressEvent['data']['message']['parts'][number],
  prevPath: string,
  pathIndex: number = 0,
) => {
  if (pathIndex < (currentPart.path?.length ?? 0)) {
    const part = createPart(prevParts, currentPart?.path?.[pathIndex], prevPath)
    if (!part.detail) {
      part.detail = []
    }
    populatePart(part.detail, currentPart, part.path, pathIndex + 1)
    part.current += currentPart.current
    part.total += currentPart.total
  } else {
    const part = createPart(prevParts, currentPart.name, prevPath)
    part.current = currentPart.current
    part.total = currentPart.total
  }
}

export const formatProgressEventParts = (
  parts: CollectProgressEvent['data']['message']['parts'],
  name: string,
): FormattedProgressEventParts => {
  const newParts: FormattedProgressEventParts[] = []
  for (let part of parts) {
    populatePart(newParts, part, name)
  }
  const sums = { current: 0, total: 0 }
  for (let part of newParts) {
    sums.current += part.current
    sums.total += part.total
  }
  return {
    name,
    current: sums.current,
    total: sums.total,
    path: name,
    detail: newParts,
  }
}
