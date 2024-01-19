/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'

defineMock({
  // list
  url: '/api/workspaces/',
  method: 'GET',
  response: responseJSONWithAuthCheck([
    {
      id: '00000000-0000-0000-0000-000000000000',
      members: ['00000000-0000-0000-0000-000000000000'],
      name: 'My Organization',
      owners: ['00000000-0000-0000-0000-000000000000'],
      slug: 'my-org',
    },
  ]),
})
