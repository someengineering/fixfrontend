/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { model } from '../data'
import { getQueryFromReq, responseJSONWithAuthCheck } from '../utils'
import { getKindsFromModel } from './utils'

defineMock({
  // model
  url: '/api/workspaces/:workspaceId/inventory/model',
  method: 'GET',
  response: responseJSONWithAuthCheck(({ req }) => {
    const kind = getQueryFromReq<{ kind: string }>(req)?.kind ?? ''
    if (kind) {
      return getKindsFromModel(kind, [])
    }
    return model as unknown[]
  }),
})
