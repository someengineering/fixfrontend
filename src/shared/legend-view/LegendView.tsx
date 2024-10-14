import { Paper, PaperProps } from '@mui/material'
import { ElementType } from 'react'

export function LegendView<RootComponent extends ElementType = 'div', AdditionalProps = unknown>(
  props: PaperProps<RootComponent, AdditionalProps>,
) {
  return <Paper elevation={0} {...props} sx={{ borderRadius: '16px', py: 2.5, px: 3, ...props.sx }} />
}
