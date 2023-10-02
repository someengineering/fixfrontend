import { Box, styled } from '@mui/material'
import { PropsWithChildren } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'

interface PanelAppBarProps extends PropsWithChildren {
  open: boolean
  isDesktop: boolean
}

const BottomRegion = styled(Box, { shouldForwardProp })<{ open: boolean; isDesktop: boolean }>(({ theme, open, isDesktop }) => ({
  position: 'fixed',
  display: 'flex',
  margin: '0 auto',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  width: isDesktop ? `calc(100% - ${theme.spacing(7)} - 1px)` : '100%',
  bottom: 0,
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
  return (
    <BottomRegion isDesktop={isDesktop} open={open}>
      {children}
    </BottomRegion>
  )
}
