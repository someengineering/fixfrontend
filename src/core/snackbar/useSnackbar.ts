import { useContext } from 'react'
import { SnackbarContext, SnackbarContextValue } from './SnackbarProvider'

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used inside the SnackbarProvider')
  }
  return context
}
