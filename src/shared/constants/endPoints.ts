export const endPoints = {
  auth: {
    forgotPassword: 'api/auth/forgot-password',
    jwt: {
      logout: 'api/auth/jwt/logout',
      login: 'api/auth/jwt/login',
    },
    oauthAccounts: (providerId: string) => `api/auth/oauth-accounts/${providerId}`,
    oauthAssociate: 'api/auth/oauth-associate',
    oauthProviders: 'api/auth/oauth-providers',
    register: 'api/auth/register',
    requestVerifyToken: 'api/auth/request-verify-token',
    resetPassword: 'api/auth/reset-password',
    verify: 'api/auth/verify',
  },
  info: 'api/info',
  users: {
    me: {
      self: 'api/users/me',
      settings: {
        notifications: 'api/users/me/settings/notifications',
      },
    },
  },
  workspaces: {
    self: 'api/workspaces/',
    workspace: (workspaceId: string) => ({
      billing: `api/workspaces/${workspaceId}/billing`,
      billingEntries: `api/workspaces/${workspaceId}/billing_entries/`,
      subscriptionItem: (subscriptionId: string) => `api/workspaces/${workspaceId}/subscription/${subscriptionId}`,
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
        report: {
          benchmark: (benchmarkName: string) => ({
            self: `api/workspaces/${workspaceId}/inventory/report/benchmark/${benchmarkName}`,
            result: `api/workspaces/${workspaceId}/inventory/report/benchmark/${benchmarkName}/result`,
          }),
          check: (checkId: string) => `api/workspaces/${workspaceId}/inventory/report/check/${checkId}`,
          config: `api/workspaces/${workspaceId}/inventory/report/config`,
          info: `api/workspaces/${workspaceId}/inventory/report/info`,
        },
        search: {
          start: `api/workspaces/${workspaceId}/inventory/search/start`,
          table: `api/workspaces/${workspaceId}/inventory/search/table`,
        },
        model: `api/workspaces/${workspaceId}/inventory/model`,
        node: (nodeId: string) => `api/workspaces/${workspaceId}/inventory/node/${nodeId}`,
        property: {
          attributes: `api/workspaces/${workspaceId}/inventory/property/attributes`,
          values: `api/workspaces/${workspaceId}/inventory/property/values`,
          path: {
            complete: `api/workspaces/${workspaceId}/inventory/property/path/complete`,
          },
        },
      },
      alerting: {
        settings: `api/workspaces/${workspaceId}/alerting/setting`,
      },
      notification: {
        add: {
          discord: `api/workspaces/${workspaceId}/notification/add/discord`,
          email: `api/workspaces/${workspaceId}/notification/add/email`,
          pagerduty: `api/workspaces/${workspaceId}/notification/add/pagerduty`,
          slack: `api/workspaces/${workspaceId}/notification/add/slack`,
          teams: `api/workspaces/${workspaceId}/notification/add/teams`,
        },
        discord: `api/workspaces/${workspaceId}/notification/discord`,
        email: `api/workspaces/${workspaceId}/notification/email`,
        pagerduty: `api/workspaces/${workspaceId}/notification/pagerduty`,
        slack: `api/workspaces/${workspaceId}/notification/slack`,
        teams: `api/workspaces/${workspaceId}/notification/teams`,
        list: `api/workspaces/${workspaceId}/notifications`,
      },
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
      subscription: (subscriptionId: string) => `api/workspaces/${workspaceId}/subscription/${subscriptionId}`,
      cfUrl: `api/workspaces/${workspaceId}/cf_url`,
      cfTemplate: `api/workspaces/${workspaceId}/cf_template`,
      externalId: `api/workspaces/${workspaceId}/external_id`,
      events: `api/workspaces/${workspaceId}/events`,
    }),
  },
}
