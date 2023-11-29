export const numberToShortHRT = (value: number) => {
  let result = ''
  if (value >= 1000) {
    value = Math.round(value / 1000)
    if (value >= 1000) {
      value = Math.round(value / 1000)
      if (value >= 1000) {
        return ':)'
      }
      result = value.toLocaleString() + 'M'
    } else {
      result = value.toLocaleString() + 'K'
    }
  } else {
    result = value.toLocaleString()
  }
  return result
}
