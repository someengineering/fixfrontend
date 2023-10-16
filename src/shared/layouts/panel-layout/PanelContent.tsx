import { Box, styled } from '@mui/material'
import { PropsWithChildren } from 'react'
import { panelUI } from 'src/shared/constants'

const Container = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginBottom: panelUI.bottomCopyRightHeight + 'px',
  marginTop: panelUI.headerHeight + 'px',
}))

export const PanelContent = ({ children }: PropsWithChildren) => {
  return <Container component="main">{children}</Container>
}
