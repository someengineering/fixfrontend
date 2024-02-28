/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { getBodyFromRawRequest } from '../utils'
import { setEmail, setToken, token } from './authData'

export default defineMock({
  // login
  url: '/api/auth/jwt/login',
  method: 'POST',
  response: async (req, res) => {
    const body = await getBodyFromRawRequest<{ username?: string; password?: string }>(req, res, true)
    if (!body || !body.username || body.username === 'fail') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: 'LOGIN_BAD_CREDENTIALS',
        }),
      )
      return
    }
    if (body.username === 'unverified') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: 'LOGIN_USER_NOT_VERIFIED',
        }),
      )
      return
    }
    setToken(encodeURIComponent(body.username))
    setEmail(body.username)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Set-Cookie', [
      `session_token=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=lax; Secure`,
      'fix.authenticated=1; Max-Age=3600; Path=/; SameSite=lax',
    ])
    res.setHeader('Strict-Transport-Security', 'max-age=15724800; includeSubDomains')
    res.statusCode = 204
    res.end()
  },
})
