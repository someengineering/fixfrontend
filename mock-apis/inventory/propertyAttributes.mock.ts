/* eslint-disable no-restricted-imports */
import { defineMock } from 'vite-plugin-mock-dev-server'
import { tags } from '../data'
import { getBodyFromRawRequest, getQueryFromReq, parseQueryString, responseJSONWithAuthCheck } from '../utils'

export default defineMock({
  // property/attributes
  url: '/api/workspaces/:workspaceId/inventory/property/attributes',
  method: 'POST',
  response: responseJSONWithAuthCheck(async ({ req, res }) => {
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
})
