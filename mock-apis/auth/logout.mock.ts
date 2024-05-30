import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  // logout
  url: '/api/auth/jwt/logout',
  method: 'POST',
  response: (_, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Set-Cookie', [
      `session_token=""; HttpOnly; Max-Age=0; Path=/; SameSite=lax; Secure`,
      'fix.authenticated=0; Max-Age=3600; Path=/; SameSite=lax',
    ])
    res.setHeader('Strict-Transport-Security', 'max-age=15724800; includeSubDomains')
    res.statusCode = 204
    res.end()
  },
})
