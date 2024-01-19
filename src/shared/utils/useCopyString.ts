import { t } from '@lingui/macro'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { useCallback } from 'react'
import { useSnackbar } from 'src/core/snackbar'
import { GTMEventNames } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { TrackJS } from 'trackjs'
import { getAuthData } from './localstorage'

export const useCopyString = (withSnackbar = true) => {
  const { showSnackbar } = useSnackbar()
  const [, copyString] = useCopyToClipboard()
  const handleCopy = useCallback(
    async (str: string) => {
      try {
        await copyString(str)
        if (withSnackbar) {
          await showSnackbar(t`Copied to Clipboard!`)
        }
      } catch (err) {
        if (TrackJS.isInstalled()) {
          TrackJS.track(err as Error)
        }
        const { message, name, stack } = err as Error
        const { isAuthenticated, selectedWorkspaceId } = getAuthData() || {}
        sendToGTM({
          event: GTMEventNames.Error,
          message,
          name,
          stack: stack || '',
          authorized: isAuthenticated || false,
          workspaceId: selectedWorkspaceId || '',
        })
      }
    },
    [copyString, showSnackbar, withSnackbar],
  )
  return handleCopy
}
