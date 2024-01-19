/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { getBodyFromRawRequest, responseJSONWithAuthCheck } from '../utils'
import { getAccount, getNextHourTime } from './utils'

export default defineMock({
  // rename cloud-account
  url: '/api/workspaces/:workspaceId/cloud_account/:cloudAccountId',
  method: 'PATCH',
  response: responseJSONWithAuthCheck(async ({ req, res }) => {
    const { name } = (await getBodyFromRawRequest<{ name: string }>(req, res, true)) ?? {}
    if (name === undefined) {
      res.statusCode = 422
      res.end(
        JSON.stringify({
          detail: [
            {
              loc: ['name', 0],
              msg: 'Name is empty',
              type: 'string',
            },
          ],
        }),
      )
      return
    }
    const foundAccount = getAccount(req, res)
    if (!foundAccount) {
      return
    }
    foundAccount.user_account_name = name
    return { ...foundAccount, next_scan: getNextHourTime() }
  }),
})
