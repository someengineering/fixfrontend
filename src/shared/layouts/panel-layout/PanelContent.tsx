import { Box, Stack, useMediaQuery } from '@mui/material'
import { forwardRef, PropsWithChildren, ReactNode } from 'react'
import { panelUI } from 'src/shared/constants'

interface PanelContent extends PropsWithChildren {
  bottom?: ReactNode
}

export const PanelContent = forwardRef<HTMLDivElement | null, PanelContent>(({ children }, mainRef) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  return (
    <Stack
      flexGrow={1}
      pt={isDesktop ? undefined : `${panelUI.headerHeight}px`}
      position="relative"
      width="100%"
      height="100%"
      overflow="hidden"
      ref={mainRef}
    >
      <Box component="main" p={3} flexGrow={1} sx={{ overflowY: 'auto' }} height="100%">
        {children}
      </Box>
      {/* <PanelBottom>{bottom}</PanelBottom> */}
    </Stack>
  )
})
