/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { workspaceAddedCloudAccounts, workspaceDiscoveredCloudAccounts, workspaceRecentCloudAccounts } from '../data'
import { responseJSONWithAuthCheck } from '../utils'
import { getAccountIndex } from './utils'

export default defineMock({
  // delete cloud-account
  url: '/api/workspaces/:workspaceId/cloud_account/:cloudAccountId',
  method: 'DELETE',
  response: responseJSONWithAuthCheck(({ req, res }) => {
    const foundAccount = getAccountIndex(req, res)
    if (foundAccount.index < 0) {
      return
    }
    if (foundAccount.state === 'added') {
      workspaceAddedCloudAccounts.splice(foundAccount.index, 1)
    }
    if (foundAccount.state === 'discovered') {
      workspaceDiscoveredCloudAccounts.splice(foundAccount.index, 1)
    }
    if (foundAccount.state === 'recent') {
      workspaceRecentCloudAccounts.splice(foundAccount.index, 1)
    }
    return ''
  }),
})
