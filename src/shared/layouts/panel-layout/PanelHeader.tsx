import { Theme, useMediaQuery } from '@mui/material'
import { PropsWithChildren, useState } from 'react'
import { PanelAppBar } from './PanelAppBar'
import { PanelDrawer } from './PanelDrawer'

interface PanelContentProps extends PropsWithChildren {}

export const PanelHeader = ({ children }: PanelContentProps) => {
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))

  const [open, setOpen] = useState(isDesktop)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <PanelAppBar onDrawerOpen={handleDrawerOpen} isDesktop={isDesktop} onDrawerToggle={handleDrawerToggle} open={open}>
        {children}
      </PanelAppBar>
      <PanelDrawer isDesktop={isDesktop} open={open} onDrawerClose={handleDrawerClose}>
        {children}
      </PanelDrawer>
    </>
  )
}
