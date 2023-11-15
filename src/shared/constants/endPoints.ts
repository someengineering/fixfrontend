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
  workspaces: {
    self: 'api/workspaces/',
    workspace: (workspaceId: string) => ({
      self: `api/workspaces/${workspaceId}`,
      cfUrl: `api/workspaces/${workspaceId}/cf_url`,
      cfTemplate: `api/workspaces/${workspaceId}/cf_template`,
      externalId: `api/workspaces/${workspaceId}/external_id`,
      cloudAccounts: {
        cloudAccount: (cloudAccountId: string) => ({
          self: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}`,
          enable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/enable`,
          disable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/disable`,
        }),
        self: `api/workspaces/${workspaceId}/cloud_accounts`,
        lastScan: `api/workspaces/${workspaceId}/cloud_accounts/lastScan`,
      },
      inventory: {
        reportSummary: `api/workspaces/${workspaceId}/inventory/report-summary`,
        search: {
          start: `/api/workspaces/${workspaceId}/inventory/search/start`,
          table: `/api/workspaces/${workspaceId}/inventory/search/table`,
        },
        model: `/api/workspaces/${workspaceId}/inventory/model`,
        property: {
          attributes: `/api/workspaces/${workspaceId}/inventory/property/attributes`,
          values: `/api/workspaces/${workspaceId}/inventory/property/values`,
        },
      },
      events: `api/workspaces/${workspaceId}/events`,
    }),
  },
  users: {
    me: 'api/users/me',
  },
}
