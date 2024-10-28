import { PropsWithChildren } from 'react'
import { NonceContext } from './NonceContext'

export const NonceProvider = ({ children, nonce }: PropsWithChildren<{ nonce?: string }>) => (
  <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
)
