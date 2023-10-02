import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Divider, DrawerProps, IconButton, Drawer as MuiDrawer, styled } from '@mui/material'
import { PropsWithChildren, MouseEvent as ReactMouseEvent } from 'react'
import { panelUI } from 'src/shared/constants'
import { drawerClosedMixin, drawerOpenedMixin } from 'src/shared/utils/mixins'
import { DrawerMenu } from './DrawerMenu'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
  onDrawerClose: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: panelUI.drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...drawerOpenedMixin(theme),
    '& .MuiDrawer-paper': drawerOpenedMixin(theme),
  }),
  ...(!open && {
    ...drawerClosedMixin(theme),
    '& .MuiDrawer-paper': drawerClosedMixin(theme),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const DrawerContent = ({ children, onDrawerClose, open }: Omit<PanelAppBarProps, 'isDesktop'>) => {
  return (
    <>
      <DrawerHeader>
        <IconButton>{children}</IconButton>
        <IconButton onClick={onDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <DrawerMenu open={open} />
    </>
  )
}

export const PanelDrawer = ({ children, onDrawerClose, open, isDesktop }: PanelAppBarProps) => {
  const drawerProps: DrawerProps = isDesktop
    ? {
        variant: 'permanent',
      }
    : {
        variant: 'temporary',
        onClose: onDrawerClose,
        ModalProps: { keepMounted: true },
      }
  return (
    <>
      <Drawer {...drawerProps} open={open}>
        <DrawerContent onDrawerClose={onDrawerClose} open={open}>
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}
