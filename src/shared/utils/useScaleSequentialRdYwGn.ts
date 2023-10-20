import { useMemo } from 'react'
import { scaleSequentialRdYwGn } from './scaleSequentialRdYwGn'

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useScaleSequentialRdYwGn = (domain: number[]) => useMemo(() => scaleSequentialRdYwGn(domain), [JSON.stringify(domain)])
