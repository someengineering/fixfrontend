import { CSSObject, Theme } from '@mui/material'
import { panelUI } from '../constants/panelUI'

export const drawerOpenedMixin = (theme: Theme): CSSObject => ({
  width: panelUI.drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

export const drawerClosedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: panelUI.drawerWidthMobile,
  [theme.breakpoints.up('sm')]: {
    width: panelUI.drawerWidthClosed,
  },
})
