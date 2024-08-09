export const getNumberFormatter = (locale: string) => (value: number | null) => (value ? Math.round(value).toLocaleString(locale) : '-')
