import { clearAllCookies, cookieMatch, isAuthenticated } from './cookie'

describe('cookie', () => {
  beforeEach(() => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'status=active; fix.authenticated=1',
    })
  })
  test('cookieMatch should match properly', () => {
    const value = 'active'
    const name = 'status'
    const matchExactly = cookieMatch(name, value)
    const matchRegex = cookieMatch(name, /act.*/)
    const matchFn = cookieMatch(name, (str) => str.startsWith('act'))
    const notMatchExactly = cookieMatch(name, 'act')
    const notMatchRegex = cookieMatch(name, /Act.*/)
    const notMatchFn = cookieMatch(name, (str) => str.endsWith('act'))
    const justValue = cookieMatch(name)
    const nothing = cookieMatch('nothing')
    expect(matchExactly).toBe(true)
    expect(matchRegex).toBe(true)
    expect(matchFn).toBe(true)
    expect(notMatchExactly).toBe(false)
    expect(notMatchRegex).toBe(false)
    expect(notMatchFn).toBe(false)
    expect(justValue).toBe(value)
    expect(nothing).toBe(undefined)
  })
  test('isAuthenticated should return true', () => {
    const authenticated = isAuthenticated()
    expect(authenticated).toBe(true)
  })
  test('clearAllCookies should remove all cookie', () => {
    clearAllCookies()
    expect(window.document.cookie).toBe('fix.authenticated=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=localhost ;path=')
  })
})
