/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { responseJSONWithAuthCheck } from '../utils'
import { getAccount, getNextHourTime } from './utils'

export default defineMock({
  // enable cloud-account
  url: '/api/workspaces/:workspaceId/cloud_account/:cloudAccountId/enable',
  method: 'PATCH',
  response: responseJSONWithAuthCheck(({ req, res }) => {
    const foundAccount = getAccount(req, res)
    if (!foundAccount) {
      return
    }
    foundAccount.enabled = true
    return { ...foundAccount, next_scan: getNextHourTime() }
  }),
})
