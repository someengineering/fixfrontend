import { Divider, Modal as MuiModal, ModalProps as MuiModalProps, Stack, Typography, styled } from '@mui/material'
import { FormEvent, MutableRefObject, ReactNode, useEffect, useState } from 'react'
import { panelUI } from 'src/shared/constants'

interface ModalProps extends Omit<MuiModalProps, 'onSubmit' | 'title' | 'onClose' | 'open'> {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  openRef: MutableRefObject<((show?: boolean) => void) | undefined>
  width?: number | string
  defaultOpen?: boolean
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  onClose?: () => void
}

const ModalContent = styled(Stack<'form' | 'div'>)(({ theme, width }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: width ? undefined : panelUI.minModalWidth,
  width: width ? (typeof width === 'number' ? width + 'px' : (width as string)) : undefined,
  maxWidth: `calc(100% - ${theme.spacing(2)})`,
  maxHeight: `calc(100% - ${theme.spacing(2)})`,
  overflow: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  boxShadow: theme.shadows['24'],
  padding: theme.spacing(2, 3, 3),
}))

export const Modal = ({ children, actions, description, title, openRef, defaultOpen, width, onSubmit, onClose, ...reset }: ModalProps) => {
  const [open, setOpen] = useState(defaultOpen ?? false)
  useEffect(() => {
    openRef.current = (show?: boolean) => {
      setOpen(show ?? true)
    }
    return () => {
      openRef.current = () => {}
    }
  }, [openRef])
  return (
    <MuiModal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...reset}
      open={open}
      onClose={() => {
        setOpen(false)
        onClose?.()
      }}
    >
      <ModalContent
        spacing={2}
        width={width}
        component={onSubmit ? 'form' : 'div'}
        onSubmit={
          onSubmit
            ? (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                onSubmit(e)
              }
            : undefined
        }
      >
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
