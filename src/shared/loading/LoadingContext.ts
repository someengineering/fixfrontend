import { createContext } from 'react'

export enum LoadingStateType {
  SHOW,
  SHOW_NO_BACKGROUND,
  HIDE,
}

export type LoadingContextValue = {
  showLoading: (forceFullpage?: boolean) => void
  hideLoading: (forceFullpage?: boolean) => void
}

export const LoadingContext = createContext<LoadingContextValue | null>(null)
