/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { workspaceAddedCloudAccounts, workspaceDiscoveredCloudAccounts, workspaceRecentCloudAccounts } from '../data'
import { responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // cloud-accounts
  url: '/api/workspaces/:workspaceId/cloud_accounts',
  method: 'GET',
  response: responseJSONWithAuthCheck(() => {
    return {
      recent: workspaceRecentCloudAccounts,
      added: workspaceAddedCloudAccounts,
      discovered: workspaceDiscoveredCloudAccounts,
    }
  }),
})
