import { TermValue } from 'src/shared/fix-query-parser'

export const termValueToStringArray = (value?: TermValue) =>
  value && Array.isArray(value) && !value.find((item) => typeof item !== 'string')
    ? (value as string[])
    : typeof value === 'string'
      ? [value]
      : typeof value === 'number'
        ? [value.toString()]
        : []
