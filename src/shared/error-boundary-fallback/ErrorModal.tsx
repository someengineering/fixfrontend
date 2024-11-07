import { Divider, Modal, Stack, Typography, styled } from '@mui/material'
import { ReactNode } from 'react'
import { BuildFilledIcon } from 'src/assets/icons'

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

export interface ErrorModalProps {
  errorIcon?: ReactNode
  onReset?: () => void
  title: ReactNode
  description: ReactNode
  actions: ReactNode
}

export const ErrorModal = ({ onReset, actions, description, title, errorIcon }: ErrorModalProps) => {
  return (
    <Modal open onClose={onReset} aria-labelledby="modal-error-title" aria-describedby="modal-error-description">
      <ModalContent spacing={2}>
        <Typography id="modal-error-title" variant="h5" component={Stack} alignItems="center" direction="row" gap={1}>
          {errorIcon ?? <BuildFilledIcon color="error" />}
          {title}
        </Typography>
        <Typography id="modal-error-description" textAlign="justify" mb={1}>
          {description}
        </Typography>
        <Divider />
        <Stack spacing={{ sm: 1 }} justifyContent="end" direction="row" flexWrap="wrap">
          {actions}
        </Stack>
      </ModalContent>
    </Modal>
  )
}
