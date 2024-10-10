import { alpha, Divider, IconButton, Modal as MuiModal, Slide, Stack, StackProps, styled } from '@mui/material'
import { ReactNode } from 'react'
import { CloseIcon } from 'src/assets/icons'

const Modal = styled(MuiModal)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 'initial',
  height: '100%',
  width: '100%',
  overflow: 'hidden',

  [theme.breakpoints.up('lg')]: {
    width: '50%',
    height: '100vh',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
  },
}))

interface RightSliderProps extends Omit<StackProps, 'title'> {
  title: ReactNode
  open: boolean
  onClose: () => void
}

export const RightSlider = ({ title, children, open, onClose, ...rest }: RightSliderProps) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            sx: {
              background: alpha('#000000', 0.6),
            },
          },
        }}
      >
        <Slide in={open} direction="left" mountOnEnter unmountOnExit>
          <Stack width="100%" height="100%" bgcolor="common.white">
            <Stack px={3} py={2.5} direction="row" spacing={1.5}>
              <Stack flex={1} justifyContent="center">
                {title}
              </Stack>
              <IconButton size="small" color="info" onClick={onClose}>
                <CloseIcon width={40} height={40} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack overflow="auto" {...rest}>
              {children}
            </Stack>
          </Stack>
        </Slide>
      </Modal>
    </>
  )
}
