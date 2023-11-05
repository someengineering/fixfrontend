/* eslint-disable @typescript-eslint/no-misused-promises */
import { IncomingMessage, ServerResponse } from 'http'
import { MockMethod } from 'vite-plugin-mock'
import { workspaceCloudAccounts } from './data'
import { getBodyFromRawRequest, responseJSONWithAuthCheck } from './utils'

const getNextHourTime = (dateTime = new Date()) => {
  dateTime.setHours(dateTime.getHours() + 1)
  return dateTime.toISOString()
}

const getAccountIndex = (req: IncomingMessage, res: ServerResponse) => {
  const accountId = (req.url?.split('/') ?? [])[5]
  const foundAccount = workspaceCloudAccounts.findIndex((i) => i.id === accountId)
  if (foundAccount < 0) {
    res.statusCode = 422
    res.end(
      JSON.stringify({
        detail: [
          {
            loc: ['cloud_account_id', 0],
            msg: 'Account id could not be found',
            type: 'string',
          },
        ],
      }),
    )
  }
  return foundAccount
}

const getAccount = (req: IncomingMessage, res: ServerResponse) => {
  const foundAccount = getAccountIndex(req, res)
  return foundAccount > -1 ? workspaceCloudAccounts[foundAccount] : undefined
}

const cloudAccounts = (): MockMethod[] => {
  return [
    // cloud-accounts
    {
      url: '/api/workspaces/:wordspaceid/cloud_accounts',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(() => {
        const nextScan = getNextHourTime()
        return workspaceCloudAccounts.map((i) => ({ ...i, next_scan: nextScan }))
      }),
    },
    // rename cloud-account
    {
      url: '/api/workspaces/:wordspaceid/cloud_account/:cloudaccountid',
      method: 'patch',
      rawResponse: responseJSONWithAuthCheck(async ({ req, res }) => {
        const { name } = (await getBodyFromRawRequest<{ name: string }>(req, res, true)) ?? {}
        if (!name) {
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
        foundAccount.name = name
        return foundAccount
      }),
    },
    // enable cloud-account
    {
      url: '/api/workspaces/:wordspaceid/cloud_account/:cloudaccountid/enable',
      method: 'patch',
      rawResponse: responseJSONWithAuthCheck(({ req, res }) => {
        const foundAccount = getAccount(req, res)
        if (!foundAccount) {
          return
        }
        foundAccount.enabled = true
        return foundAccount
      }),
    },
    // disable cloud-account
    {
      url: '/api/workspaces/:wordspaceid/cloud_account/:cloudaccountid/disable',
      method: 'patch',
      rawResponse: responseJSONWithAuthCheck(({ req, res }) => {
        const foundAccount = getAccount(req, res)
        if (!foundAccount) {
          return
        }
        foundAccount.enabled = false
        return foundAccount
      }),
    },
    // delete cloud-account
    {
      url: '/api/workspaces/:wordspaceid/cloud_account/:cloudaccountid',
      method: 'delete',
      rawResponse: responseJSONWithAuthCheck(({ req, res }) => {
        const foundAccount = getAccountIndex(req, res)
        if (foundAccount < 0) {
          return
        }
        workspaceCloudAccounts.splice(foundAccount, 1)
        return ''
      }),
    },
  ]
}

export default cloudAccounts
