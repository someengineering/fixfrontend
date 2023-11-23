import { Box } from '@mui/material'
import { PropsWithChildren, ReactNode } from 'react'
import { panelUI } from 'src/shared/constants'
import { PanelBottom } from './PanelBottom'

interface PanelContent extends PropsWithChildren {
  bottom: ReactNode
}

export const PanelContent = ({ children, bottom }: PanelContent) => {
  return (
    <Box width="100%" display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
      <Box
        p={3}
        mb={2}
        mt={panelUI.headerHeight + 'px'}
        component="main"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        position="relative"
      >
        {children}
      </Box>
      <PanelBottom>{bottom}</PanelBottom>
    </Box>
  )
}
