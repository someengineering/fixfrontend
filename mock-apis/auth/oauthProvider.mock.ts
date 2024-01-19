/* eslint-disable no-restricted-imports */
import { loadEnv } from 'vite'
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  // oauth-providers
  url: '/api/auth/oauth-providers',
  method: 'POST',
  body: ({ query }) => {
    const env = loadEnv('test', process.cwd(), '')
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
})
