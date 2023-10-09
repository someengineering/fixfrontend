export const endPoints = {
  auth: {
    jwt: {
      logout: '/api/auth/jwt/logout',
    },
    oauthProviders: '/api/auth/oauth-providers',
  },
  workspaces: {
    get: '/api/workspaces/',
    cf_url: (workspaceId: string) => `/api/workspaces/${workspaceId}/cf_url`,
    cf_template: (workspaceId: string) => `/api/workspaces/${workspaceId}/cf_template`,
    externalId: (workspaceId: string) => `/api/workspaces/${workspaceId}/external_id`,
  },
}
