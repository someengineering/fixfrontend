import { alpha, Box, Divider, IconButton, Modal as MuiModal, Slide, Stack, StackProps, styled } from '@mui/material'
import { ReactNode } from 'react'
import { CloseIcon } from 'src/assets/icons'

const Modal = styled(MuiModal)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 'auto',
  height: '100%',
  width: '100%',

  [theme.breakpoints.up('md')]: {
    width: '50%',
    height: '100vh',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
  },

  [theme.breakpoints.up('lg')]: {
    width: '42%',
    maxWidth: 604,
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
      <Modal open={open} onClose={onClose} slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }}>
        <Slide in={open} direction="left" mountOnEnter unmountOnExit>
          <Stack
            position="absolute"
            top={0}
            right={0}
            width="100%"
            height="100%"
            sx={{
              bgcolor: 'common.white',
              boxShadow: 24,
              borderTopLeftRadius: { xs: '0', md: '12px' },
              borderBottomLeftRadius: { xs: '0', md: '12px' },
            }}
            direction="column"
            overflow="auto"
          >
            <Stack direction="row" p={3} position="sticky" top={-8} zIndex="modal" boxShadow={1}>
              <Box flex={1}>{title}</Box>
              <Box>
                <IconButton onClick={onClose} color="info" size="small">
                  <CloseIcon width={35} height={35} />
                </IconButton>
              </Box>
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
