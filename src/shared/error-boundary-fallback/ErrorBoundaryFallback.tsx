import { Trans } from '@lingui/macro'
import BuildIcon from '@mui/icons-material/Build'
import { Button, Divider, Link, Modal, Stack, Typography, styled } from '@mui/material'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { DiscrodIcon } from 'src/assets/icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { getAuthData } from 'src/shared/utils/localstorage'

const ModalContent = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  maxWidth: `calc(100% - ${theme.spacing(2)}px)`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2, 4, 3),
}))

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useAbsoluteNavigate()

  useEffect(() => {
    if (!('isAxiosError' in error) || !error.isAxiosError) {
      const { message, name, stack } = error
      const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
      const authorized = isAuthenticated() || false
      sendToGTM({
        event: 'error',
        message: jsonToStr(message),
        name: jsonToStr(name),
        stack: jsonToStr(stack),
        workspaceId,
        authorized,
      })
    }
  }, [error])

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
            <Link href={env.discordUrl} target="_blank">
              on Discord
            </Link>
            . Thanks for your patience!
          </Trans>
        </Typography>
        <Divider />
        <Stack spacing={1} justifyContent="end" direction="row">
          <Stack justifySelf="start">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                resetErrorBoundary()
                navigate('/')
              }}
            >
              <Trans>Homepage</Trans>
            </Button>
          </Stack>
          <Button
            onClick={resetErrorBoundary}
            variant="contained"
            sx={{ mt: 1 }}
            color="primary"
            startIcon={<DiscrodIcon />}
            href={env.discordUrl}
            target="_blank"
          >
            Discord
          </Button>
          <Button onClick={resetErrorBoundary} variant="outlined" sx={{ mt: 1 }} color="warning">
            <Trans>Try again</Trans>
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  )
}
