import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button, CircularProgress, IconButton, LinearProgress, Stack, Tooltip, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePostHog } from 'posthog-js/react'
import { ForwardedRef, forwardRef, useRef, useState } from 'react'
import { DownloadIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableDownloadMutation } from 'src/pages/panel/shared/queries'
import { panelUI } from 'src/shared/constants'
import { Modal } from 'src/shared/modal'
import { PostHogEvent } from 'src/shared/posthog'
import { WorkspaceInventorySearchTableHistory, WorkspaceInventorySearchTableSort } from 'src/shared/types/server'

interface DownloadCSVButtonProps {
  query: string
  history?: WorkspaceInventorySearchTableHistory
  sort?: WorkspaceInventorySearchTableSort[]
  hasWarning?: boolean
}

export const DownloadCSVButton = forwardRef(
  ({ query, history, sort, hasWarning, ...tooltipProps }: DownloadCSVButtonProps, ref: ForwardedRef<HTMLButtonElement | null>) => {
    const postHog = usePostHog()
    const {
      i18n: { locale },
    } = useLingui()
    const warningModal = useRef<(show?: boolean | undefined) => void>()
    const { currentUser, selectedWorkspace } = useUserProfile()
    const [progress, setProgress] = useState(-1)
    const { mutateAsync, isPending } = useMutation({
      mutationFn: postWorkspaceInventorySearchTableDownloadMutation,
    })
    const abortController = useRef<AbortController>()
    const handleClick = () => {
      abortController.current = new AbortController()
      mutateAsync({
        onDownloadProgress: (ev) => {
          setProgress(ev.total ? Math.round((ev.loaded * 100) / ev.total) : -1)
        },
        history,
        sort,
        query,
        signal: abortController.current.signal,
        workspaceId: selectedWorkspace?.id ?? '',
      })
        .then((res) => {
          if (res) {
            const href = URL.createObjectURL(res?.data)
            const link = window.document.createElement('a')
            link.href = href
            link.setAttribute('download', 'inventory.csv')
            window.document.body.appendChild(link)
            link.click()
            window.document.body.removeChild(link)
            URL.revokeObjectURL(href)
          } else {
            throw new Error('response is empty')
          }
        })
        .catch((error) => {
          if (!axios.isAxiosError(error)) {
            const { name: error_name, message: error_message, stack: error_stack } = (error as Error) ?? {}
            postHog.capture(PostHogEvent.Error, {
              $set: { ...currentUser },
              authenticated: true,
              user_id: currentUser?.id,
              workspace_id: selectedWorkspace?.id,
              error_name,
              error_message,
              error_stack,
            })
          }
        })
        .finally(() => warningModal.current?.(false))
    }
    const children = hasWarning ? (
      <>
        <IconButton onClick={() => warningModal.current?.(true)} disabled={isPending}>
          <DownloadIcon />
        </IconButton>
        <Modal
          openRef={warningModal}
          title={
            <Typography component="span" variant="h5" color="warning.main">
              <Trans>Warning</Trans>
            </Typography>
          }
          actions={
            <Button {...tooltipProps} variant="outlined" startIcon={<DownloadIcon />} onClick={handleClick} disabled={isPending} ref={ref}>
              <Stack
                minWidth={isPending ? 160 : 0}
                height={isPending ? 25 : 'auto'}
                sx={{ transition: ({ transitions }) => transitions.create('min-width') }}
                alignItems="center"
                justifyContent="center"
                flex="1 0 auto"
              >
                {isPending ? (
                  <LinearProgress variant={progress >= 0 ? 'determinate' : 'indeterminate'} value={progress} sx={{ width: '100%' }} />
                ) : (
                  <Trans>Download CSV</Trans>
                )}
              </Stack>
            </Button>
          }
        >
          <Typography>
            <Trans>
              Because the data is over {panelUI.maxCSVDownload.toLocaleString(locale)} Only first{' '}
              {panelUI.maxCSVDownload.toLocaleString(locale)} items will be downloaded
            </Trans>
          </Typography>
        </Modal>
      </>
    ) : (
      <IconButton {...tooltipProps} onClick={handleClick} disabled={isPending} ref={ref}>
        {isPending ? <CircularProgress size={16} /> : <DownloadIcon />}
      </IconButton>
    )
    return isPending ? (
      children
    ) : (
      <Tooltip title={<Trans>Download CSV</Trans>} arrow>
        {children}
      </Tooltip>
    )
  },
)
