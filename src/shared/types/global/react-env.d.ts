import { Jsx } from 'hast-util-to-jsx-runtime'
import { ReactElement } from 'react'
import { Entries } from 'type-fest/source/entries.d'

declare module 'react/jsx-runtime' {
  export const Fragment: ReactElement
  export const jsx: Jsx
  export const jsxs: Jsx
}

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>
  }
}
