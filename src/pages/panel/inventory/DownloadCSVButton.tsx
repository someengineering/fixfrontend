import { Trans } from '@lingui/macro'
import DownloadIcon from '@mui/icons-material/Download'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Button, CircularProgress, LinearProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ForwardedRef, forwardRef, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventorySearchTableDownloadMutation } from 'src/pages/panel/shared/queries'
import { GTMEventNames } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { TrackJS } from 'trackjs'

interface DownloadCSVButtonProps {
  query: string
  warning?: boolean
}

export const DownloadCSVButton = forwardRef(
  ({ query, warning, ...tooltipProps }: DownloadCSVButtonProps, ref: ForwardedRef<HTMLButtonElement | null>) => {
    const { selectedWorkspace } = useUserProfile()
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
            TrackJS.track(error as Error)
            const { message, name, stack = 'unknown' } = (error as Error) ?? {}
            sendToGTM({
              event: GTMEventNames.Error,
              message: jsonToStr(message),
              name: jsonToStr(name),
              stack: jsonToStr(stack),
              workspaceId: selectedWorkspace?.id ?? 'unknown',
              authorized: true,
            })
          }
        })
    }
    return (
      <Button
        {...tooltipProps}
        variant="outlined"
        startIcon={progress < 0 && isPending ? <CircularProgress color="inherit" size={16} /> : isPending ? null : <DownloadIcon />}
        endIcon={warning ? <WarningAmberIcon /> : null}
        onClick={handleClick}
        disabled={isPending}
        color={warning ? 'warning' : 'primary'}
        ref={ref}
      >
        {progress >= 0 && isPending ? <LinearProgress valueBuffer={100} value={progress} /> : <Trans>Download CSV</Trans>}
      </Button>
    )
  },
)
