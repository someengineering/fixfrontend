import { Slide, useScrollTrigger } from '@mui/material'
import { ReactElement } from 'react'

interface HideOnScrollProps {
  children: ReactElement
}
export const HideOnScroll = ({ children }: HideOnScrollProps) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}
