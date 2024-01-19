export const endPoints = {
  info: 'api/info',
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
      settings: `api/workspaces/${workspaceId}/settings`,
      invites: {
        list: `api/workspaces/${workspaceId}/invites/`,
        self: (inviteId: string) => `api/workspaces/${workspaceId}/invites/${inviteId}`,
      },
      users: {
        list: `api/workspaces/${workspaceId}/users/`,
        self: (userId: string) => `api/workspaces/${workspaceId}/users/${userId}`,
      },
      acceptInvite: `api/workspaces/${workspaceId}/accept_invite`,
      billing: `api/workspaces/${workspaceId}/billing`,
      subscription: (subscriptionId: string) => `api/workspaces/${workspaceId}/subscription/${subscriptionId}`,
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
          path: {
            complete: `/api/workspaces/${workspaceId}/inventory/property/path/complete`,
          },
        },
        node: (nodeId: string) => `api/workspaces/${workspaceId}/inventory/node/${nodeId}`,
      },
      billingEntries: `api/workspaces/${workspaceId}/billing_entries/`,
      events: `api/workspaces/${workspaceId}/events`,
    }),
  },
  users: {
    me: 'api/users/me',
  },
}
