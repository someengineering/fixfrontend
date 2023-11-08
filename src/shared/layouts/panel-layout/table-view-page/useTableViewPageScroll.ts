import { createContext, RefObject, useContext } from 'react'

export const TableViewPageScrollContext = createContext<RefObject<HTMLDivElement> | null>(null)

export function useTableViewPageScroll(): RefObject<HTMLDivElement> {
  const context = useContext(TableViewPageScrollContext)
  if (!context) {
    throw new Error('useTableViewPageScroll must be used inside the TableViewPage')
  }
  return context
}
