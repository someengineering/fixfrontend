/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { searchStart } from '../data'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // search/start
  url: '/api/workspaces/:workspaceId/inventory/search/start',
  method: 'GET',
  response: responseJSONWithAuthCheck(searchStart),
})
