import { createContext, ReactNode } from 'react'

export interface ButtonRegionContextValue {
  content: ReactNode
  setContent: (content: ReactNode) => void
}

export const ButtonsRegionContext = createContext<ButtonRegionContextValue>({ content: null, setContent: () => {} })
