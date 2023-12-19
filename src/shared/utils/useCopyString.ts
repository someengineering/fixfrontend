import { t } from '@lingui/macro'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { useCallback } from 'react'
import { useSnackbar } from 'src/core/snackbar'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { getAuthData } from './localstorage'

export const useCopyString = () => {
  const { showSnackbar } = useSnackbar()
  const [, copyString] = useCopyToClipboard()
  const handleCopy = useCallback(
    async (str: string) => {
      try {
        await copyString(str)
        await showSnackbar(t`Copied to Clipboard!`)
      } catch (err) {
        const { message, name, stack } = err as Error
        const { isAuthenticated, selectedWorkspaceId } = getAuthData() || {}
        sendToGTM({
          event: 'error',
          message,
          name,
          stack: stack || '',
          authorized: isAuthenticated || false,
          workspaceId: selectedWorkspaceId || '',
        })
      }
    },
    [copyString, showSnackbar],
  )
  return handleCopy
}
