export function getArrayFromInOP<WithNull extends boolean = false>(value: string, withNull?: WithNull) {
  return value
    .substring(1, value.length - 1)
    .split(',')
    .map((i) => (i === 'null' && withNull ? null : i))
    .filter((i) => i || (withNull && i === null)) as WithNull extends true ? (string | null)[] : string[]
}
