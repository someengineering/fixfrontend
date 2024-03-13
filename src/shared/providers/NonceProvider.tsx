// eslint-disable-next-line no-restricted-imports
import { PropsWithChildren, createContext } from 'react'

export const NonceContext = createContext<string | undefined>(undefined)

export const NonceProvider = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => (
  <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
)
