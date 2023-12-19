/* eslint-disable @typescript-eslint/no-misused-promises */
import { loadEnv } from 'vite'
import { MockConfig, MockMethod } from 'vite-plugin-mock'
import { getBodyFromRawRequest, parseQueryString } from './utils'

const auth = (config: MockConfig): MockMethod[] => {
  let token = ''
  let email = ''
  const id = '12345678-9abc-def0-1234-56789abcdefg'
  return [
    // login
    {
      url: '/api/auth/jwt/login',
      method: 'post',
      rawResponse: async (req, res) => {
        const reqbody = await getBodyFromRawRequest(req, res)
        const body = parseQueryString<{ username?: string; password?: string }>(reqbody, '%40')
        if (!body.username || body.username === 'fail') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: 'LOGIN_BAD_CREDENTIALS',
            }),
          )
        }
        if (body.username === 'unverfied') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: 'LOGIN_USER_NOT_VERIFIED',
            }),
          )
        }
        token = encodeURIComponent(body.username)
        email = body.username
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Set-Cookie', [
          `fix.auth=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=lax; Secure`,
          'fix.authenticated=1; Max-Age=3600; Path=/; SameSite=lax',
        ])
        res.setHeader('Strict-Transport-Security', 'max-age=15724800; includeSubDomains')
        res.statusCode = 204
        res.end()
      },
    },
    // register
    {
      url: '/api/auth/register',
      method: 'post',
      rawResponse: async (req, res) => {
        const body = await getBodyFromRawRequest<{ email: string; password: string }>(req, res, true)
        if (!body) {
          return
        }
        if (body.email === 'exists') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: 'REGISTER_USER_ALREADY_EXISTS',
            }),
          )
        }
        if (body.password === 'bad') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: {
                code: 'REGISTER_INVALID_PASSWORD',
                reason: 'Password should beat least 3 characters',
              },
            }),
          )
        }
        email = body.email
        res.statusCode = 200
        res.end(
          JSON.stringify({
            id,
            email,
            is_active: true,
            is_superuser: false,
            is_verified: false,
          }),
        )
      },
    },
    // verify-token
    {
      url: '/api/auth/verify',
      method: 'post',
      rawResponse: async (req, res) => {
        const body = await getBodyFromRawRequest<{ token: string }>(req, res, true)
        if (!body) {
          return
        }
        if (body.token === 'fail') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: 'VERIFY_USER_BAD_TOKEN',
            }),
          )
        }
        if (body.token === 'verified') {
          res.statusCode = 400
          return res.end(
            JSON.stringify({
              detail: 'VERIFY_USER_BAD_TOKEN',
            }),
          )
        }
        email = body.token
        res.statusCode = 200
        res.end(
          JSON.stringify({
            id,
            email,
            is_active: true,
            is_superuser: false,
            is_verified: false,
          }),
        )
      },
    },
    // logout
    {
      url: '/api/auth/jwt/logout',
      method: 'post',
      rawResponse: (_, res) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Set-Cookie', [
          `fix.auth=""; HttpOnly; Max-Age=0; Path=/; SameSite=lax; Secure`,
          'fix.authenticated=0; Max-Age=3600; Path=/; SameSite=lax',
        ])
        res.setHeader('Strict-Transport-Security', 'max-age=15724800; includeSubDomains')
        res.statusCode = 204
        res.end()
      },
    },
    // oauth-providers
    {
      url: '/api/auth/oauth-providers',
      method: 'get',
      response: ({ query }) => {
        const env = loadEnv(config.mode, process.cwd(), '')
        const { redirect_url } = query as { redirect_url: string }
        return [
          {
            name: 'google',
            authUrl: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=624226762755-rcjf5jmku6n2q7jcugdfnaup8vjoa3f1.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
              env.HOST,
            )}${env.PORT ? encodeURIComponent(`:${env.PORT}`) : ''}%2Fapi%2Fauth%2Fgoogle%2Fcallback&state=${encodeURIComponent(
              encodeURIComponent(JSON.stringify({ redirect_url })),
            )}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`,
          },
          {
            name: 'github',
            authUrl: `https://github.com/login/oauth/authorize?response_type=code&client_id=228e837d811a703ccc5f&redirect_uri=https%3A%2F%2Fapp.dev-eu.fixcloud.io%2Fapi%2Fauth%2Fgithub%2Fcallback&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWRpcmVjdF91cmwiOiIvIiwiYXVkIjoiZmFzdGFwaS11c2VyczpvYXV0aC1zdGF0ZSIsImV4cCI6MTY5ODc4MTkzN30.huG8OIw8-ShDB5MHnf1WRrfjlcwHXfltBB638oSGLp0&scope=user+user%3Aemail`,
          },
        ]
      },
    },
  ]
}

export default auth
