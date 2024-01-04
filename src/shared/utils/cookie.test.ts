import { clearAllCookies, cookieMatch, isAuthenticated } from './cookie'

describe('cookie', () => {
  beforeEach(() => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'status=active; fix.authenticated=1',
    })
  })
  test('cookieMatch should match properly', () => {
    const matchExactly = cookieMatch('status', 'active')
    const matchRegex = cookieMatch('status', /act.*/)
    const matchFn = cookieMatch('status', (str) => str.startsWith('act'))
    const notMatchExactly = cookieMatch('status', 'act')
    const notMatchRegex = cookieMatch('status', /Act.*/)
    const notMatchFn = cookieMatch('status', (str) => str.endsWith('act'))
    expect(matchExactly).toBe(true)
    expect(matchRegex).toBe(true)
    expect(matchFn).toBe(true)
    expect(notMatchExactly).toBe(false)
    expect(notMatchRegex).toBe(false)
    expect(notMatchFn).toBe(false)
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
