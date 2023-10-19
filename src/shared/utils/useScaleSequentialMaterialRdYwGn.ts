import { scaleSequential } from 'd3'
import { useMemo } from 'react'
import { useInterpolateMaterialRdYwGn } from './useInterpolateMaterialRdYwGn'

export const useScaleSequentialMaterialRdYwGn = (min: number, max: number, variant: 'dark' | 'light' | 'main' = 'main') => {
  const interpolate = useInterpolateMaterialRdYwGn(variant)
  return useMemo(() => scaleSequential().interpolator(interpolate).domain([min, max]), [interpolate, min, max])
}
