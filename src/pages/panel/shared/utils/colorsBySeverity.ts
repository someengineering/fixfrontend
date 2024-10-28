import { colors } from '@mui/material'
import { colorFromRedToGreen } from 'src/shared/constants'

export const colorsBySeverity = {
  Critical: colorFromRedToGreen[0],
  High: colorFromRedToGreen[35],
  Medium: colorFromRedToGreen[50],
  Low: colorFromRedToGreen[65],
  Info: colors.grey[500],
  Passed: colorFromRedToGreen[100],
} as const
