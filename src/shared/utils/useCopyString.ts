import { t } from '@lingui/macro'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'
import { useSnackbar } from 'src/core/snackbar'
import { PostHogEvent } from 'src/shared/constants'
import { getAuthData } from './localstorage'

export const useCopyString = (withSnackbar = true) => {
  const postHog = usePostHog()
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
        if (window.TrackJS?.isInstalled()) {
          window.TrackJS.track(err as Error)
        }
        const { name: error_name, message: error_message, stack: error_stack } = err as Error
        const { isAuthenticated, selectedWorkspaceId } = getAuthData() || {}
        postHog.capture(PostHogEvent.Error, {
          authenticated: isAuthenticated ?? false,
          workspace_id: selectedWorkspaceId,
          error_name,
          error_message,
          error_stack,
        })
      }
    },
    [copyString, postHog, showSnackbar, withSnackbar],
  )
  return handleCopy
}
