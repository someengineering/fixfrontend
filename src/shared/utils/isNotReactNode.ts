import { ReactNode } from 'react'

export const isNotReactNode = (node: ReactNode) => {
  switch (typeof node) {
    case 'string':
    case 'number':
      return false
    default:
      return true
  }
}
