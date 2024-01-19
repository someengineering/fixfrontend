import { email, id, setEmail } from './authData'
/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { getBodyFromRawRequest } from '../utils'

export default defineMock({
  // verify-token
  url: '/api/auth/verify',
  method: 'POST',
  response: async (req, res) => {
    const body = await getBodyFromRawRequest<{ token: string }>(req, res, true)
    if (!body) {
      return
    }
    if (body.token === 'fail') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: 'VERIFY_USER_BAD_TOKEN',
        }),
      )
      return
    }
    if (body.token === 'verified') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: 'VERIFY_USER_BAD_TOKEN',
        }),
      )
      return
    }
    setEmail(body.token)
    res.statusCode = 200
    res.end(
      JSON.stringify({
        id,
        email,
        is_active: true,
        is_superuser: false,
        is_verified: false,
      }),
    )
  },
})
