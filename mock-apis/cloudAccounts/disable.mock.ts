/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'
import { getAccount, getNextHourTime } from './utils'

export default defineMock({
  // disable cloud-account
  url: '/api/workspaces/:workspaceId/cloud_account/:cloudAccountId/disable',
  method: 'PATCH',
  response: responseJSONWithAuthCheck(({ req, res }) => {
    const foundAccount = getAccount(req, res)
    if (!foundAccount) {
      return
    }
    foundAccount.enabled = false
    return { ...foundAccount, next_scan: getNextHourTime() }
  }),
})
