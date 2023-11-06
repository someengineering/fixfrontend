import { IncomingMessage, ServerResponse } from 'http'

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

export const parseQueryString = <T extends object>(query: string, split: string) => querySplittedToJSON<T>(query.split(split))

export const querySplittedToJSON = <T extends object>(query: string[]) =>
  query.reduce((prev, cur) => {
    const [key, value] = cur.split('=')
    return key ? { ...prev, [key]: value } : prev
  }, {} as T)

export const getTokenInfo = (cookie: string) => {
  const cookies = parseQueryString<{ 'fix.auth'?: string }>(cookie, '; ')
  if (!cookies['fix.auth']) {
    return false
  }
  return decodeURIComponent(cookies['fix.auth'])
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
export function responseJSONWithAuthCheck<T extends object | string | number | unknown[]>(
  json: T | ((params: { req: IncomingMessage; res: ServerResponse; email: string }) => T | Promise<T> | undefined | Promise<undefined>),
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const email = req.headers.cookie
    if (!email) {
      res.statusCode = 401
      res.end(JSON.stringify({ detail: 'Unauthorized' }))
    } else {
      res.statusCode = 200
      const data = typeof json === 'function' ? ((await json({ req, res, email })) as T) : json
      if (data !== undefined || data !== null) {
        res.end(typeof data === 'object' ? JSON.stringify(data) : data)
      }
    }
  }
}
