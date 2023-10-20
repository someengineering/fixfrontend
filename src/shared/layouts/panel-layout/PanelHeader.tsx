import { Theme, useMediaQuery } from '@mui/material'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { PanelAppBar } from './PanelAppBar'
import { PanelBottom } from './PanelBottom'
import { PanelDrawer } from './PanelDrawer'

interface PanelContentProps extends PropsWithChildren {
  bottomChild?: ReactNode
}

export const PanelHeader = ({ children, bottomChild }: PanelContentProps) => {
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'))

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
      <PanelBottom isDesktop={isDesktop} open={open}>
        {bottomChild}
      </PanelBottom>
    </>
  )
}
