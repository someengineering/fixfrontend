export const endPoints = {
  auth: {
    jwt: {
      logout: '/api/auth/jwt/logout',
    },
    oauthProviders: '/api/auth/oauth-providers',
  },
  users: {
    me: '/api/users/me',
  },
  workspaces: {
    get: '/api/workspaces/',
    cfUrl: (workspaceId: string) => `/api/workspaces/${workspaceId}/cf_url`,
    cfTemplate: (workspaceId: string) => `/api/workspaces/${workspaceId}/cf_template`,
    externalId: (workspaceId: string) => `/api/workspaces/${workspaceId}/external_id`,
    inventory: {
      reportSummary: (workspaceId: string) => `/api/workspaces/${workspaceId}/inventory/report-summary`,
    },
    events: (workspaceId: string) => `/api/workspaces/${workspaceId}/events`,
  },
}
