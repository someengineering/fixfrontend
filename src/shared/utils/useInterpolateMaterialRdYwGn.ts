import { useTheme } from '@mui/material'
import { interpolateRgbBasis } from 'd3'
import { useMemo } from 'react'

export const useInterpolateMaterialRdYwGn = (variant: 'dark' | 'light' | 'main' = 'main') => {
  const theme = useTheme()
  return useMemo(
    () => interpolateRgbBasis([theme.palette.error[variant], theme.palette.warning[variant], theme.palette.success[variant]]),
    [theme, variant],
  )
}
