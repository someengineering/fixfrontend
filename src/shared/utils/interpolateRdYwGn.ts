import { colors } from '@mui/material'
import { interpolateRgbBasis } from 'd3'

export const interpolateRdYwGn = interpolateRgbBasis([
  colors.red[900],
  colors.deepOrange[700],
  colors.amber[600],
  colors.lightGreen[500],
  colors.green[900],
])
