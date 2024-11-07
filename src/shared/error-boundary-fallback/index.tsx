import { Trans } from '@lingui/macro'
import { Button, Link, Stack } from '@mui/material'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { DiscordIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env, panelUI } from 'src/shared/constants'
import { PostHogEvent } from 'src/shared/posthog'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { NetworkErrorBoundary } from './ErrorBoundary'
import { ErrorModal } from './ErrorModal'

const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const postHog = usePostHog()
  const navigate = useAbsoluteNavigate(true)

  useEffect(() => {
    if (!('isAxiosError' in error) || !(error as AxiosError).isAxiosError) {
      const { name: error_name, message: error_message, stack: error_stack } = error as Error
      postHog.capture(PostHogEvent.Error, {
        authenticated: isAuthenticated(),
        workspace_id: getAuthData()?.selectedWorkspaceId,
        error_name,
        error_message,
        error_stack,
      })
    }
  }, [error, postHog])

  return (
    <ErrorModal
      onReset={resetErrorBoundary}
      title={<Trans>Oops! Something went wrong.</Trans>}
      description={
        <Trans>
          We're sorry for the inconvenience. Our team has been notified, and the issue is being looked into. Please try again in a few
          minutes. If the problem persists, feel free to contact us{' '}
          <Link href={env.discordUrl} target="_blank" rel="noopener noreferrer">
            on Discord
          </Link>
          . Thanks for your patience!
        </Trans>
      }
      actions={
        <>
          <Stack justifySelf="start" mb={{ xs: 1, sm: 0 }} mr={{ xs: 1, sm: 0 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                resetErrorBoundary()
                if (navigate) {
                  navigate(panelUI.homePage)
                }
              }}
            >
              <Trans>Homepage</Trans>
            </Button>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<DiscordIcon />}
            href={env.discordUrl}
            rel="noopener noreferrer"
            sx={{ mb: { xs: 1, sm: 0 }, mr: { xs: 1, sm: 0 } }}
            target="_blank"
          >
            Discord
          </Button>
          <Button onClick={resetErrorBoundary} variant="outlined" color="warning" sx={{ mb: { xs: 1, sm: 0 }, mr: { xs: 1, sm: 0 } }}>
            <Trans>Try again</Trans>
          </Button>
        </>
      }
    />
  )
}

export { ErrorBoundaryFallback, ErrorModal, NetworkErrorBoundary }
