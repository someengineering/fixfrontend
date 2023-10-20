import { scaleSequential } from 'd3'
import { interpolateRdYwGn } from './interpolateRdYwGn'

export const scaleSequentialRdYwGn = scaleSequential().interpolator(interpolateRdYwGn).domain
