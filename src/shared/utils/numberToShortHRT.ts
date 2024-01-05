const shortHRTDict = ['', 'K', 'M', 'B', 'T']

export const numberToShortHRT = (value: number, locale?: Intl.LocalesArgument) => {
  let i = 0
  while (value >= 1000) {
    value = Math.round(value / 1000)
    i++
  }
  return i < shortHRTDict.length ? `${value.toLocaleString(locale)}${shortHRTDict[i]}` : ':)'
}
