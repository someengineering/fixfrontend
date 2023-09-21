export const cookieMatch = (name: string, match?: string | RegExp | ((value: string) => boolean)) => {
  const splittedByName = document.cookie.split(name + '=')
  const value = splittedByName[1].split(';')[0]
  if (typeof match === 'function') {
    return match(value)
  } else if (typeof match === 'string') {
    return value === match
  } else if (match && typeof match === 'object' && match instanceof RegExp) {
    return match.test(value)
  } else {
    return value
  }
}
