import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { forwardRef, PropsWithChildren, ReactNode } from 'react'
import { panelUI } from 'src/shared/constants'

interface PanelContent extends PropsWithChildren {
  bottom?: ReactNode
}

export const PanelContent = forwardRef<HTMLDivElement | null, PanelContent>(({ children }, mainRef) => {
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  return (
    <Stack
      flexGrow={1}
      py={isDesktop ? undefined : `${panelUI.headerHeight}px`}
      position="relative"
      width="100%"
      height="100%"
      sx={{ overflowY: 'auto' }}
      ref={mainRef}
    >
      <Box component="main" p={3} flexGrow={1}>
        {children}
      </Box>
      {/* <PanelBottom>{bottom}</PanelBottom> */}
    </Stack>
  )
})
