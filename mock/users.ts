/* eslint-disable @typescript-eslint/no-misused-promises */
import { MockMethod } from 'vite-plugin-mock'
import { responseJSONWithAuthCheck } from './utils'

const users = (): MockMethod[] => {
  return [
    // me
    {
      url: '/api/users/me',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(({ email }) => ({
        id: '12345678-9abc-def0-1234-56789abcdefg',
        email,
        is_active: true,
        is_superuser: false,
        is_verified: false,
      })),
    },
  ]
}

export default users
