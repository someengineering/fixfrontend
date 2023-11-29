/// <reference types="vite/client" />

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

interface ImportMetaEnv {
  readonly VITE_SERVER?: string
  readonly VITE_WS_SERVER?: string
  readonly VITE_USE_PROXY?: string
  readonly VITE_NETWORK_RETRY_COUNT?: string
  readonly VITE_WEBSOCKET_RETRY_TIMEOUT?: string
  readonly VITE_DISCORD_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
