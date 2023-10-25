import { StorageKeys } from 'src/shared/constants'

export function cookieMatch(name: string, match: string | RegExp | ((value: string) => boolean)): boolean
export function cookieMatch(name: string, match?: undefined | never): string | undefined
export function cookieMatch(name: string, match?: string | RegExp | ((value: string) => boolean)) {
  const splittedByName = window.document.cookie?.split(name + '=')
  const value = splittedByName?.[1]?.split(';')?.[0]
  if (typeof match === 'function') {
    return match(value)
  } else if (typeof match === 'string') {
    return value === match
  } else if (match && typeof match === 'object' && match instanceof RegExp) {
    return match.test(value)
  } else {
    return value || undefined
  }
}

export const isAuthenticated = () => cookieMatch(StorageKeys.authenticated, '1')

export const clearAllCookies = () => {
  const cookies = window.document.cookie.split('; ')
  for (let cookieIndex = 0; cookieIndex < cookies.length; cookieIndex++) {
    const domain = window.location.hostname.split('.')
    while (domain.length > 0) {
      const cookieBase =
        window.encodeURIComponent(cookies[cookieIndex].split(';')[0].split('=')[0]) +
        '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' +
        domain.join('.') +
        ' ;path='
      const schema = window.location.pathname.split('/')
      window.document.cookie = cookieBase + '/'
      while (schema.length > 0) {
        window.document.cookie = cookieBase + schema.join('/')
        schema.pop()
      }
      domain.shift()
    }
  }
}
