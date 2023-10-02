import { t } from '@lingui/macro'
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, AppBar as MuiAppBar, Toolbar, styled } from '@mui/material'
import { PropsWithChildren, MouseEvent as ReactMouseEvent } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { HideOnScroll } from './HideOnScroll'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
  onDrawerOpen: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  onDrawerToggle: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const AppBar = styled(MuiAppBar, { shouldForwardProp })<{ open: boolean; isDesktop: boolean }>(({ theme, open, isDesktop }) => ({
  zIndex: open ? theme.zIndex.appBar : theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: panelUI.headerHeight,
  ...(open &&
    isDesktop && {
      marginLeft: panelUI.drawerWidth,
      width: `calc(100% - ${panelUI.drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}))

const MenuIconButton = styled(IconButton, { shouldForwardProp })<{ open: boolean; isDesktop: boolean }>(({ open, isDesktop }) => ({
  m: 2,
  display: isDesktop && open ? 'none' : 'flex',
}))

export const PanelAppBar = ({ children, open, isDesktop, onDrawerOpen, onDrawerToggle }: PanelAppBarProps) => {
  const Content = (
    <AppBar position="fixed" open={open} isDesktop={isDesktop}>
      <Toolbar>
        <MenuIconButton
          color="inherit"
          aria-label={t`Open drawer`}
          onClick={isDesktop ? onDrawerOpen : onDrawerToggle}
          edge="start"
          open={open}
          isDesktop={isDesktop}
        >
          <MenuIcon />
        </MenuIconButton>
        {children}
      </Toolbar>
    </AppBar>
  )
  return isDesktop ? Content : <HideOnScroll>{Content}</HideOnScroll>
}
