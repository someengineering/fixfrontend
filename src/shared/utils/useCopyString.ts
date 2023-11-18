import { t } from '@lingui/macro'
import { useCallback } from 'react'
import { useSnackbar } from 'src/core/snackbar'

export const useCopyString = () => {
  const { showSnackbar } = useSnackbar()
  const handleCopy = useCallback(
    async (str: string) => {
      try {
        await window.navigator.clipboard.writeText(str)
        await showSnackbar(t`Copied to Clipboard!`)
      } catch {
        /* empty */
      }
    },
    [showSnackbar],
  )
  return handleCopy
}
