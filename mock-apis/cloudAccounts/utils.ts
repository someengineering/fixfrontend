/* eslint-disable no-restricted-imports */
import { IncomingMessage, ServerResponse } from 'http'
import { workspaceAddedCloudAccounts, workspaceDiscoveredCloudAccounts, workspaceRecentCloudAccounts } from '../data'

type AccountState = 'added' | 'recent' | 'discovered'

export const getNextHourTime = (dateTime = new Date()) => {
  dateTime.setHours(dateTime.getHours() + 1)
  return dateTime.toISOString()
}

export const getAccountIndex = (req: IncomingMessage, res: ServerResponse) => {
  const accountId = (req.url?.split('/') ?? [])[5]
  let index = -1
  let state: AccountState = 'added'
  index = workspaceAddedCloudAccounts.findIndex((i) => i.id === accountId)
  if (index < 0) {
    state = 'recent'
    index = workspaceRecentCloudAccounts.findIndex((i) => i.id === accountId)
  }
  if (index < 0) {
    state = 'discovered'
    index = workspaceDiscoveredCloudAccounts.findIndex((i) => i.id === accountId)
  }
  if (index < 0) {
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
  return { index, state }
}

export const getAccount = (req: IncomingMessage, res: ServerResponse) => {
  const foundAccount = getAccountIndex(req, res)
  return foundAccount.state === 'added'
    ? workspaceAddedCloudAccounts[foundAccount.index]
    : foundAccount.state === 'recent'
      ? workspaceRecentCloudAccounts[foundAccount.index]
      : workspaceDiscoveredCloudAccounts[foundAccount.index]
}
