/* eslint-disable @typescript-eslint/no-misused-promises */
import { MockMethod } from 'vite-plugin-mock'
import { model, searchStart, tags, workspaceReportSummary } from './data'
import { getBodyFromRawRequest, getQueryFromReq, parseQueryString, responseJSONWithAuthCheck } from './utils'

const getKindsFromModel = (baseKind: string, kindsSoFar: string[]): unknown[] => {
  const base = model.find((j: { fqn: string }) => j.fqn === baseKind) as {
    fqn: string
    properties: Record<string, { kind: { type: string; fqn: string; items: { type: string; fqn: string } } }>
  }
  const data = Object.values(base.properties)
    .map((i) =>
      i.kind.type === 'object' ? i.kind.fqn : i.kind.type === 'array' && i.kind.items.type === 'object' ? i.kind.items.fqn : undefined,
    )
    .filter((i) => i && !kindsSoFar.includes(i))
    .map((i) => getKindsFromModel(i as string, [baseKind, ...kindsSoFar]))
    .flat()

  return [base, ...data]
}

const inventory = (): MockMethod[] => {
  return [
    // report-summary
    {
      url: '/api/workspaces/:workspaceid/inventory/report-summary',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(workspaceReportSummary),
    },
    // search/start
    {
      url: '/api/workspaces/:workspaceid/inventory/search/start',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(searchStart),
    },
    // property/attributes
    {
      url: '/api/workspaces/:workspaceid/inventory/property/attributes',
      method: 'post',
      rawResponse: responseJSONWithAuthCheck(async ({ req, res }) => {
        const reqbody = await getBodyFromRawRequest(req, res)
        const { prop } = parseQueryString<{ query?: string; prop?: string }>(reqbody, '&')
        const { skip = '0', limit = '10' } = getQueryFromReq<{ skip: string; limit: string }>(req) ?? {}
        const skipNumber = Number(skip)
        const limitNumber = Number(limit)
        if (Number.isNaN(skipNumber) || Number.isNaN(limitNumber)) {
          res.statusCode = 422
          res.end(
            JSON.stringify({
              detail: [
                {
                  loc: ['skip', 0],
                  msg: 'skip or limit is wrong, they should be a number',
                  type: 'string',
                },
              ],
            }),
          )
          return
        }
        if (prop === 'tags') {
          return tags.slice(skipNumber, limitNumber)
        }
        res.statusCode = 422
        res.end(
          JSON.stringify({
            detail: [
              {
                loc: ['prop', 0],
                msg: `this prop (${prop}) is not supported`,
                type: 'string',
              },
            ],
          }),
        )
        return
      }),
    },
    // model
    {
      url: '/api/workspaces/:workspaceid/inventory/model',
      method: 'get',
      rawResponse: responseJSONWithAuthCheck(({ req }) => {
        const kind = getQueryFromReq<{ kind: string }>(req)?.kind ?? ''
        if (kind) {
          return getKindsFromModel(kind, [])
        }
        return model as unknown[]
      }),
    },
  ]
}

export default inventory
