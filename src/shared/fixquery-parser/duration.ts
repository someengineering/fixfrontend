import { alt, apply, buildLexer, expectSingleResult, rep_sc, rule, seq, tok } from 'typescript-parsec'

export enum TimeUnit {
  Space,
  And,
  Comma,
  Integer,
  Year,
  Month,
  Day,
  Week,
  Hour,
  Min,
  Sec,
}

const TimeUnitDef: [TimeUnit, string[]][] = [
  [TimeUnit.Year, ['years', 'year', 'yr', 'y']],
  [TimeUnit.Month, ['months', 'month', 'mo', 'M']],
  [TimeUnit.Day, ['days', 'day', 'd']],
  [TimeUnit.Week, ['weeks', 'week', 'w']],
  [TimeUnit.Hour, ['hours', 'hour', 'h']],
  [TimeUnit.Min, ['minutes', 'minute', 'min', 'm']],
  [TimeUnit.Sec, ['seconds', 'second', 's']],
]

const time_tokens: [boolean, RegExp, TimeUnit][] = TimeUnitDef.flatMap(
  ([unit, names]) => names.map((name) => [true, new RegExp(`^${name}`, 'g'), unit]) as [boolean, RegExp, TimeUnit][],
)
const DurationLexer = buildLexer([
  ...time_tokens,
  [false, /^\s+/g, TimeUnit.Space],
  [false, /^and+/g, TimeUnit.And],
  [false, /^,+/g, TimeUnit.Comma],
  [true, /^[+-]?[0-9]+/g, TimeUnit.Integer],
])

export const DurationP = rule<TimeUnit, number>()

const single_unit = alt(
  apply(tok(TimeUnit.Year), () => 365 * 24 * 3600),
  apply(tok(TimeUnit.Month), () => 31 * 24 * 3600),
  apply(tok(TimeUnit.Day), () => 24 * 3600),
  apply(tok(TimeUnit.Week), () => 7 * 24 * 3600),
  apply(tok(TimeUnit.Hour), () => 3600),
  apply(tok(TimeUnit.Min), () => 60),
  apply(tok(TimeUnit.Sec), () => 1),
)
const single_duration = apply(seq(tok(TimeUnit.Integer), single_unit), ([num, unit]) => parseInt(num.text) * unit)
DurationP.setPattern(apply(seq(single_duration, rep_sc(single_duration)), ([first, rest]) => rest.reduce((a, b) => a + b, first)))

export function parse_duration(expr: string): number {
  return expectSingleResult(DurationP.parse(DurationLexer.parse(expr)))
}
