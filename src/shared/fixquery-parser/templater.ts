import Mustache from 'mustache'
import { parse_duration } from './duration.ts'
import { JsonElement } from './query.ts'

export function extendViewWithHelpers(prop: JsonElement): { [key: string]: unknown } {
  return {
    toString: function () {
      return JSON.stringify(prop)
    },
    from_now: function (): string {
      if (typeof prop !== 'string') throw new Error('from_now only works with duration strings')
      const secs = parse_duration(prop)
      const now = new Date()
      now.setSeconds(now.getSeconds() + secs)
      return now.toISOString()
    },
    ago: function (): string {
      if (typeof prop !== 'string') throw new Error('from_now only works with duration strings')
      const secs = parse_duration(prop)
      const now = new Date()
      now.setSeconds(now.getSeconds() - secs)
      return now.toISOString()
    },
  }
}

export function render(template: string, data: { [key: string]: JsonElement }): string {
  const view = Object.entries(data).reduce(
    (vd, [key, value]) => {
      vd[key] = extendViewWithHelpers(value)
      return vd
    },
    {} as { [key: string]: unknown },
  )
  const result = Mustache.render(template, view)
  return result.replace(/&quot;/g, '"')
}
