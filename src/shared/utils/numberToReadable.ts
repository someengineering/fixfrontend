export const byteUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] as const
export const numberUnits = ['', 'K', 'M', 'G', 'T', 'P'] as const

interface NumberToReadableGenericArgumentsType {
  value: number
  maximumFractions?: number
  maximumDigits?: number
  locale?: Intl.LocalesArgument
}

type NumberToReadableGenericArgumentsUnit = {
  units: readonly string[]
}

export const numberToReadable = ({
  value,
  units,
  locale,
  maximumDigits = 3,
  maximumFractions = 0,
}: NumberToReadableGenericArgumentsType & NumberToReadableGenericArgumentsUnit) => {
  let absValue = Math.abs(value)
  let i = 0
  while (i < units.length && absValue >= 1000) {
    absValue = absValue / 1000
    i++
  }
  const [real, rest = ''] = absValue.toPrecision(maximumDigits).split('.')
  rest.replace(/0+$/, '')

  return `${Number(`${value < 0 ? '-' : ''}${real}.${rest || 0}`).toLocaleString(locale, { maximumFractionDigits: maximumFractions })}${units[i]}`
}

export const numberToReadableBytes = (data: NumberToReadableGenericArgumentsType) =>
  numberToReadable({ maximumDigits: 3, maximumFractions: 3, ...data, units: byteUnits })
export const numberToReadableNumber = (data: NumberToReadableGenericArgumentsType) =>
  numberToReadable({ maximumDigits: 3, maximumFractions: 0, ...data, units: numberUnits })
