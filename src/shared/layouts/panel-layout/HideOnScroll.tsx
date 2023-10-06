import { Slide, useScrollTrigger } from '@mui/material'
import { ReactElement } from 'react'

interface HideOnScrollProps {
  children: ReactElement
  direction?: 'down' | 'up'
}
export const HideOnScroll = ({ children, direction }: HideOnScrollProps) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction={direction || 'down'} in={!trigger}>
      {children}
    </Slide>
  )
}
