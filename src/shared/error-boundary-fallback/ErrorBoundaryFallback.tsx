import { Trans } from '@lingui/macro'
import BuildIcon from '@mui/icons-material/Build'
import { Button, Divider, Link, Modal, Stack, Typography, styled } from '@mui/material'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { DiscrodIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { useGTMDispatch } from 'src/shared/google-tag-manager'
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
  const sendToGTM = useGTMDispatch()
  const navigate = useAbsoluteNavigate()
  const { selectedWorkspace, isAuthenticated } = useUserProfile(false)

  useEffect(() => {
    if ('response' in error) {
      const { response, name, message, cause, status, stack, config, code, toJSON } = error
      const request = error.request as unknown
      sendToGTM({
        event: 'network-error',
        api: response?.config.url || 'unknown',
        responseData: jsonToStr(response?.data) || '',
        responseHeader: jsonToStr(response?.data) || '',
        responseStatus: jsonToStr(response?.status) || '',
        response: jsonToStr(response),
        request: jsonToStr(request),
        name: jsonToStr(name),
        message: jsonToStr(message),
        cause: jsonToStr(cause),
        status: jsonToStr(status),
        stack: jsonToStr(stack),
        config: jsonToStr(config),
        code: jsonToStr(code),
        rest: jsonToStr(toJSON()),
        workspaceId: selectedWorkspace?.id || getAuthData()?.selectedWorkspace || 'unknown',
        authorized: (isAuthenticated === undefined ? getAuthData()?.isAuthenticated : isAuthenticated) ?? false,
      })
    } else {
      const { message, name, stack } = error as Error
      sendToGTM({
        event: 'error',
        message: jsonToStr(message),
        name: jsonToStr(name),
        stack: jsonToStr(stack),
        workspaceId: selectedWorkspace?.id || getAuthData()?.selectedWorkspace || 'unknown',
        authorized: (isAuthenticated === undefined ? getAuthData()?.isAuthenticated : isAuthenticated) ?? false,
      })
    }
  }, [error, isAuthenticated, selectedWorkspace?.id, sendToGTM])

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
