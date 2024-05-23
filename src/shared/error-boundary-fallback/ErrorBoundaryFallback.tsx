import { Trans } from '@lingui/macro'
import BuildIcon from '@mui/icons-material/Build'
import { Button, Divider, Link, Modal, Stack, Typography, styled } from '@mui/material'
import { AxiosError } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { DiscordIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { PosthogEvent, env, panelUI } from 'src/shared/constants'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'

const ModalContent = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  maxWidth: `calc(100% - ${theme.spacing(2)})`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2, 4, 3),
}))

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const posthog = usePostHog()
  const navigate = useAbsoluteNavigate(true)

  useEffect(() => {
    if (!('isAxiosError' in error) || !(error as AxiosError).isAxiosError) {
      if (window.TrackJS?.isInstalled()) {
        window.TrackJS.track(error as Error)
      }
      const { name: error_name, message: error_message, stack: error_stack } = error as Error
      posthog.capture(PosthogEvent.Error, {
        authenticated: isAuthenticated(),
        workspace_id: getAuthData()?.selectedWorkspaceId,
        error_name,
        error_message,
        error_stack,
      })
    }
  }, [error, posthog])

  return (
    <Modal open onClose={resetErrorBoundary} aria-labelledby="modal-error-title" aria-describedby="modal-error-description">
      <ModalContent spacing={2}>
        <Typography id="modal-error-title" variant="h5" component={Stack} alignItems="center" direction="row">
          <BuildIcon color="error" sx={{ mr: 1 }} />
          <Trans>Oops! Something went wrong.</Trans>
        </Typography>
        <Typography id="modal-error-description" textAlign="justify" mb={1}>
          <Trans>
            We're sorry for the inconvenience. Our team has been notified, and the issue is being looked into. Please try again in a few
            minutes. If the problem persists, feel free to contact us{' '}
            <Link href={env.discordUrl} target="_blank" rel="noopener noreferrer">
              on Discord
            </Link>
            . Thanks for your patience!
          </Trans>
        </Typography>
        <Divider />
        <Stack spacing={{ sm: 1 }} justifyContent="end" direction="row" flexWrap="wrap">
          <Stack justifySelf="start" mb={{ xs: 1, sm: 0 }} mr={{ xs: 1, sm: 0 }}>
            <Button
              variant="outlined"
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
            onClick={resetErrorBoundary}
            variant="contained"
            color="primary"
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
        </Stack>
      </ModalContent>
    </Modal>
  )
}
