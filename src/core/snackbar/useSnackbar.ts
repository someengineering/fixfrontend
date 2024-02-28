import { useContext } from 'react'
import { SnackbarContext, SnackbarContextValue } from './SnackbarProvider'

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext)
  // eslint-disable-next-line @typescript-eslint/require-await
  return context ?? { closeSnackbar: async (_) => true, showSnackbar: async (_) => 0 }
}
