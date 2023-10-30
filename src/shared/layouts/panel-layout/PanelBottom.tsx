import { Stack, styled } from '@mui/material'
import { PropsWithChildren } from 'react'
import { panelUI } from 'src/shared/constants'
import { shouldForwardPropWithWhiteList } from 'src/shared/utils/shouldForwardProp'

interface PanelAppBarProps extends PropsWithChildren {}

const BottomRegion = styled(Stack<'footer'>, { shouldForwardProp: shouldForwardPropWithWhiteList(['component']) })(({ theme }) => ({
  display: 'flex',
  margin: '0 auto',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  width: '100%',
  color: theme.palette.common.black,
  minHeight: panelUI.bottomCopyRightHeight + 'px',
  background: theme.palette.common.white,
  boxShadow: theme.shadows[24],
}))

export const PanelBottom = ({ children }: PanelAppBarProps) => {
  return <BottomRegion component="footer">{children}</BottomRegion>
}
