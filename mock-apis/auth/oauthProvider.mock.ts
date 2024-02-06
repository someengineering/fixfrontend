/* eslint-disable no-restricted-imports */
import { loadEnv } from 'vite'
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  // oauth-providers
  url: '/api/auth/oauth-providers',
  method: 'GET',
  body: ({ query }) => {
    const env = loadEnv('test', process.cwd(), '')
    const { redirect_url } = query as { redirect_url: string }
    return [
      {
        name: 'google',
        authUrl: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=test&redirect_uri=${encodeURIComponent(
          env.HOST,
        )}${env.PORT ? encodeURIComponent(`:${env.PORT}`) : ''}%2Fapi%2Fauth%2Fgoogle%2Fcallback&state=${encodeURIComponent(
          encodeURIComponent(JSON.stringify({ redirect_url })),
        )}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email`,
      },
      {
        name: 'github',
        authUrl: `https://github.com/login/oauth/authorize?response_type=code&client_id=test&redirect_uri=${encodeURIComponent(
          env.HOST,
        )}${env.PORT ? encodeURIComponent(`:${env.PORT}`) : ''}%2Fapi%2Fauth%2Fgoogle%2Fcallbackk&state=${encodeURIComponent(
          encodeURIComponent(JSON.stringify({ redirect_url })),
        )}&scope=user+user%3Aemail`,
      },
    ]
  },
})
