import { useContext } from 'react'
import { LoadingContext, LoadingContextValue } from './LoadingContext'

export function useFullPageLoading(): LoadingContextValue {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used inside the FullPageLoadingProvider')
  }
  return context
}
