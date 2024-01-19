import { email, id } from './authData'
/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { getBodyFromRawRequest } from '../utils'
import { setEmail } from './authData'

export default defineMock({
  // register
  url: '/api/auth/register',
  method: 'POST',
  response: async (req, res) => {
    const body = await getBodyFromRawRequest<{ email: string; password: string }>(req, res, true)
    if (!body) {
      return
    }
    if (body.email === 'exists') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: 'REGISTER_USER_ALREADY_EXISTS',
        }),
      )
      return
    }
    if (body.password === 'bad') {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          detail: {
            code: 'REGISTER_INVALID_PASSWORD',
            reason: 'Password should beat least 3 characters',
          },
        }),
      )
      return
    }
    setEmail(body.email)
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
