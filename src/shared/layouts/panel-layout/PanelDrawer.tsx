import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { ButtonBase, Divider, DrawerProps, IconButton, Drawer as MuiDrawer, drawerClasses, styled } from '@mui/material'
import { PropsWithChildren, MouseEvent as ReactMouseEvent } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { drawerClosedMixin, drawerOpenedMixin } from 'src/shared/utils/mixins'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { DrawerMenu } from './DrawerMenu'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
  onDrawerClose: (event: ReactMouseEvent<HTMLElement, MouseEvent>) => void
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: shouldForwardPropWithBlackList(['isDesktop']) })<{ isDesktop: boolean }>(
  ({ theme, open, isDesktop }) => ({
    width: panelUI.drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...((open || !isDesktop) && {
      ...drawerOpenedMixin(theme),
      [`& .${drawerClasses.paper}`]: drawerOpenedMixin(theme),
    }),
    ...(!open &&
      isDesktop && {
        ...drawerClosedMixin(theme),
        [`& .${drawerClasses.paper}`]: drawerClosedMixin(theme),
      }),
  }),
)

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const DrawerContent = ({ children, onDrawerClose, open, isDesktop }: PanelAppBarProps) => {
  const navigate = useAbsoluteNavigate()
  return (
    <>
      <DrawerHeader>
        <ButtonBase
          href={panelUI.homePage}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate(panelUI.homePage)
          }}
        >
          {children}
        </ButtonBase>
        <IconButton onClick={onDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <DrawerMenu onClose={isDesktop ? undefined : onDrawerClose} open={open || !isDesktop} />
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
      <Drawer {...drawerProps} open={open} isDesktop={isDesktop}>
        <DrawerContent onDrawerClose={onDrawerClose} open={open} isDesktop={isDesktop}>
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}
