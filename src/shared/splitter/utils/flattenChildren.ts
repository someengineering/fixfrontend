// Taken from https://github.com/grrowl/react-keyed-flatten-children

/* Returns React children into an array, flattening fragments. */
import { Children, PropsWithChildren, ReactNode, cloneElement, isValidElement } from 'react'
import { isFragment } from 'react-is'

export const flattenChildren = (children: ReactNode, depth: number = 0, keys: (string | number)[] = []) => {
  return Children.toArray(children).reduce((acc: ReactNode[], node, nodeIndex) => {
    if (isFragment(node) && Array.isArray(acc)) {
      acc.push(...flattenChildren((node.props as PropsWithChildren).children, depth + 1, keys.concat(node.key || nodeIndex)))
    } else {
      if (isValidElement(node)) {
        acc.push(
          cloneElement(node, {
            key: keys.concat(String(node.key)).join('.'),
          }),
        )
      } else if (typeof node === 'string' || typeof node === 'number') {
        acc.push(node)
      }
    }
    return acc
  }, [])
}
