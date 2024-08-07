import { useContext } from 'react'
import { SnackbarContext, SnackbarContextValue } from './SnackbarProvider'

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext)
  return context ?? { closeSnackbar: async (_) => true, showSnackbar: async (_) => 0 }
}
