import { Divider, Modal as MuiModal, Stack, Typography, styled } from '@mui/material'
import { MutableRefObject, PropsWithChildren, ReactNode, useEffect, useState } from 'react'

interface ModalProps extends PropsWithChildren {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  openRef: MutableRefObject<((show?: boolean) => void) | undefined>
}

const ModalContent = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows['24'],
  padding: theme.spacing(2, 4, 3),
}))

export const Modal = ({ children, actions, description, title, openRef }: ModalProps) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    openRef.current = (show?: boolean) => {
      setOpen(show ?? true)
    }
    return () => {
      openRef.current = () => {}
    }
  }, [openRef])
  return (
    <MuiModal aria-labelledby="modal-title" aria-describedby="modal-description" open={open} onClose={() => setOpen(false)}>
      <ModalContent spacing={1}>
        {title && (
          <Typography id="modal-title" variant="h5">
            {title}
          </Typography>
        )}
        {description && (
          <Typography id="modal-description" variant="caption" mb={1}>
            {description}
          </Typography>
        )}
        {title || description ? <Divider /> : null}
        {children}
        <Divider />
        <Stack spacing={1} justifyContent="end" direction="row">
          {actions}
        </Stack>
      </ModalContent>
    </MuiModal>
  )
}
