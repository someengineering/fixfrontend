/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // external_id
  url: '/api/workspaces/:workspaceId/external_id',
  method: 'GET',
  response: responseJSONWithAuthCheck({
    external_id: '00000000-0000-0000-0000-000000000000',
  }),
})
