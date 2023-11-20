import { Trans } from '@lingui/macro'
import BuildIcon from '@mui/icons-material/Build'
import { Button, Divider, Link, Modal, Stack, Typography, styled } from '@mui/material'
import { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { DiscrodIcon } from 'src/assets/icons'
import { env } from 'src/shared/constants'

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
  useEffect(() => {
    console.error(error)
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
