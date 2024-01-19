/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // me
  url: '/api/users/me',
  method: 'GET',
  response: responseJSONWithAuthCheck(({ email }) => ({
    id: '12345678-9abc-def0-1234-56789abcdefg',
    email,
    is_active: true,
    is_superuser: false,
    is_verified: false,
  })),
})
