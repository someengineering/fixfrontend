import { Divider, Modal as MuiModal, Stack, Typography, styled } from '@mui/material'
import { MutableRefObject, PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { panelUI } from 'src/shared/constants'

interface ModalProps extends PropsWithChildren {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  openRef: MutableRefObject<((show?: boolean) => void) | undefined>
  width?: number | string
}

const ModalContent = styled(Stack)(({ theme, width }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: width ? undefined : panelUI.minModalWidth,
  width: width ? (typeof width === 'number' ? width + 'px' : (width as string)) : undefined,
  maxWidth: `calc(100% - ${theme.spacing(2)})`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows['24'],
  padding: theme.spacing(2, 3, 3),
}))

export const Modal = ({ children, actions, description, title, openRef, width }: ModalProps) => {
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
      <ModalContent spacing={1} width={width}>
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
