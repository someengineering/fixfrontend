import { IncomingMessage, ServerResponse } from 'http'
import { MockRequest } from 'vite-plugin-mock-dev-server'

export function getBodyFromRawRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>, isJSON?: false): Promise<string>
export function getBodyFromRawRequest<T extends object = object>(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  isJSON: true,
): Promise<T | undefined>
export async function getBodyFromRawRequest<T = object>(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  isJSON: boolean = false,
) {
  if (req.readableEnded) {
    return (req as MockRequest).body as unknown as typeof isJSON extends true ? T : string
  }
  let reqbody = ''
  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      reqbody += chunk
    })
    req.on('end', () => resolve(undefined))
  })

  if (isJSON) {
    try {
      const parsedReqBody = JSON.parse(reqbody) as T
      return parsedReqBody
    } catch {
      res.statusCode = 422
      res.end(
        JSON.stringify({
          detail: [
            {
              loc: [],
              msg: 'Is not parsable json',
              type: '',
            },
          ],
        }),
      )
      return
    }
  }

  return reqbody
}

export const parseQueryString = <T extends Record<string, unknown>>(query: string, split: string = '&') =>
  querySplittedToJSON<T>(query.split(split))

export const querySplittedToJSON = <T extends Record<string, unknown>>(query: string[]) =>
  query.reduce((prev, cur) => {
    const [key, value] = cur.split('=')
    return key ? { ...prev, [key]: value } : prev
  }, {} as T)

export const getQueryFromReq = <T extends Record<string, string>>(req: IncomingMessage) => parseQueryString<T>(req.url?.split('?')[1] ?? '')

export const getTokenInfo = (cookie: string) => {
  const cookies = parseQueryString<{ session_token?: string }>(cookie, '; ')
  if (!cookies['session_token']) {
    return false
  }
  return decodeURIComponent(cookies['session_token'])
}

export const responseWithAuthCheck = (callback: (params: { email: string; req: IncomingMessage; res: ServerResponse }) => void) => {
  return (req: IncomingMessage, res: ServerResponse) => {
    const email = req.headers.cookie
    if (!email) {
      res.statusCode = 401
      res.end(JSON.stringify({ detail: 'Unauthorized' }))
      return
    } else {
      callback({ email, req, res })
    }
  }
}

export function responseJSONWithAuthCheck<T extends string | number | unknown[] | Record<string, unknown>>(
  json: T,
): (req: IncomingMessage, res: ServerResponse) => Promise<void>
export function responseJSONWithAuthCheck<T extends string | number | unknown[] | Record<string, unknown>>(
  json: (params: { req: IncomingMessage; res: ServerResponse; email: string }) => T | undefined | Promise<T | undefined>,
): (req: IncomingMessage, res: ServerResponse) => Promise<void>
export function responseJSONWithAuthCheck<T extends string | number | unknown[] | Record<string, unknown>>(
  json: T | ((params: { req: IncomingMessage; res: ServerResponse; email: string }) => T | undefined | Promise<T | undefined>),
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const email = req.headers.cookie
    if (!email) {
      res.statusCode = 401
      res.end(JSON.stringify({ detail: 'Unauthorized' }))
      // return typeof json === 'function' ? await json({ req, res, email: '' }) : json
    } else {
      res.statusCode = 200
      const data = typeof json === 'function' ? await json({ req, res, email }) : json
      if (data !== undefined || data !== null) {
        res.end(typeof data === 'object' ? JSON.stringify(data) : data)
      }
      // return data
    }
  }
}
