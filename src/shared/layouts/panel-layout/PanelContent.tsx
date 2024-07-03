import { Box, Stack } from '@mui/material'
import { PropsWithChildren, ReactNode, useRef } from 'react'
import { panelUI } from 'src/shared/constants'
import { PanelBottom } from './PanelBottom'
import { PanelBreadcrumbs } from './PanelBreadcrumbs'
import { PageScrollContext } from './usePageScroll'

interface PanelContent extends PropsWithChildren {
  bottom: ReactNode
}

export const PanelContent = ({ children, bottom }: PanelContent) => {
  const mainRef = useRef<HTMLDivElement>(null)
  return (
    <PageScrollContext.Provider value={mainRef}>
      <Stack width="100%" flexGrow={1} overflow="hidden" height="100vh">
        <Stack mt={panelUI.headerHeight + 'px'} flexGrow={1} position="relative" sx={{ overflowY: 'auto' }} ref={mainRef}>
          <PanelBreadcrumbs />
          <Box component="main" p={3} flexGrow={1}>
            {children}
          </Box>
          <PanelBottom>{bottom}</PanelBottom>
        </Stack>
      </Stack>
    </PageScrollContext.Provider>
  )
}
