export const endPoints = {
  auth: {
    jwt: {
      logout: 'api/auth/jwt/logout',
      login: 'api/auth/jwt/login',
    },
    register: 'api/auth/register',
    forgotPassword: 'api/auth/forgot-password',
    resetPassword: 'api/auth/reset-password',
    requestVerifyToken: 'api/auth/request-verify-token',
    verify: 'api/auth/verify',
    oauthProviders: 'api/auth/oauth-providers',
  },
  users: {
    me: 'api/users/me',
  },
  workspaces: {
    self: 'api/workspaces/',
    cfUrl: (workspaceId: string) => `api/workspaces/${workspaceId}/cf_url`,
    cfTemplate: (workspaceId: string) => `api/workspaces/${workspaceId}/cf_template`,
    externalId: (workspaceId: string) => `api/workspaces/${workspaceId}/external_id`,
    inventory: {
      reportSummary: (workspaceId: string) => `api/workspaces/${workspaceId}/inventory/report-summary`,
    },
    events: (workspaceId: string) => `api/workspaces/${workspaceId}/events`,
    cloudAccount: {
      self: (workspaceId: string, cloudAccountId: string) => `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}`,
      enable: (workspaceId: string, cloudAccountId: string) => `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/enable`,
      disable: (workspaceId: string, cloudAccountId: string) => `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/disable`,
      list: {
        get: (workspaceId: string) => `api/workspaces/${workspaceId}/cloud_accounts`,
        lastScan: (workspaceId: string) => `api/workspaces/${workspaceId}/cloud_accounts/lastScan`,
      },
    },
  },
}
