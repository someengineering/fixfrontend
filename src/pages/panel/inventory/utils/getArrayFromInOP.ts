export const getArrayFromInOP = (value: string) =>
  value
    .substring(1, value.length - 1)
    .split(',')
    .map((i) => i.trim())
    .filter((i) => i)
