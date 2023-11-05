import { NumberValue, ScaleSequential, scaleSequential } from 'd3'
import { interpolateRdYwGn } from './interpolateRdYwGn'

export function scaleSequentialRdYwGn(): [number, number]
export function scaleSequentialRdYwGn(domain: NumberValue[]): ScaleSequential<string, never>
export function scaleSequentialRdYwGn(domain?: NumberValue[]) {
  return domain
    ? scaleSequential().interpolator(interpolateRdYwGn).domain(domain)
    : scaleSequential().interpolator(interpolateRdYwGn).domain()
}
