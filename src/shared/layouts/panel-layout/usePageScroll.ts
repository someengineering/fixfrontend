import { createContext, RefObject, useContext } from 'react'

export const PageScrollContext = createContext<RefObject<HTMLDivElement> | null>(null)

export function usePageScroll(): RefObject<HTMLDivElement> {
  const context = useContext(PageScrollContext)
  if (!context) {
    throw new Error('usePageScroll must be used inside the PanelContent')
  }
  return context
}
