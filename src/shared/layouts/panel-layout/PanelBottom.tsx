import { AppBar as MuiAppBar, styled } from '@mui/material'
import { PropsWithChildren } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithWhiteList } from 'src/shared/utils/shouldForwardProp'
import { HideOnScroll } from './HideOnScroll'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
}

const BottomRegion = styled(MuiAppBar<'footer'>, { shouldForwardProp: shouldForwardPropWithWhiteList(['component', 'position']) })<{
  open: boolean
  isDesktop: boolean
}>(({ theme, open, isDesktop }) => ({
  display: 'flex',
  margin: '0 auto',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  width: isDesktop ? `calc(100% - ${theme.spacing(7)} - 1px)` : '100%',
  bottom: 0,
  color: theme.palette.common.black,
  top: 'auto',
  right: 0,
  height: panelUI.bottomCopyRightHeight + 'px',
  background: theme.palette.common.white,
  boxShadow: theme.shadows[24],
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    isDesktop && {
      width: `calc(100% - ${panelUI.drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}))

export const PanelBottom = ({ children, isDesktop, open }: PanelAppBarProps) => {
  const Content = (
    <BottomRegion component="footer" isDesktop={isDesktop} open={open} position="fixed">
      {children}
    </BottomRegion>
  )
  return isDesktop ? Content : <HideOnScroll direction="up">{Content}</HideOnScroll>
}
