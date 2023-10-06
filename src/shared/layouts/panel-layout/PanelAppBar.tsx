import { t } from '@lingui/macro'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, IconButton, AppBar as MuiAppBar, Toolbar, styled } from '@mui/material'
import { PropsWithChildren, MouseEvent as ReactMouseEvent } from 'react'
import { panelUI } from 'src/shared/constants'
import { LanguageButton } from 'src/shared/language-button'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'
import { HideOnScroll } from './HideOnScroll'
import { UserProfileButton } from './UserProfileButton'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
  onDrawerOpen: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
  onDrawerToggle: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const AppBar = styled(MuiAppBar, { shouldForwardProp })<{ open: boolean; isDesktop: boolean }>(({ theme, open, isDesktop }) => ({
  zIndex: open || !isDesktop ? theme.zIndex.appBar : theme.zIndex.drawer + 1,
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

const AppBarLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 1,
  flexGrow: 0,
  [theme.breakpoints.down('md')]: {
    flexGrow: 1,
    justifyContent: 'center',
  },
}))

const AppBarActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 1,
  flexGrow: 0,
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    justifyContent: 'end',
  },
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
        <AppBarLogo>{children}</AppBarLogo>
        <AppBarActions>
          <LanguageButton whiteMode />
          <UserProfileButton />
        </AppBarActions>
      </Toolbar>
    </AppBar>
  )
  return isDesktop ? Content : <HideOnScroll>{Content}</HideOnScroll>
}
