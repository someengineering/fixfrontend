import { NotificationChannel } from 'src/shared/types/server-shared'

export const endPoints = {
  token: {
    self: '/api/token/',
    access: '/api/token/access',
    info: '/api/token/info',
  },
  auth: {
    forgotPassword: 'api/auth/forgot-password',
    jwt: {
      logout: 'api/auth/jwt/logout',
      login: 'api/auth/jwt/login',
    },
    mfa: {
      add: 'api/auth/mfa/add',
      disable: 'api/auth/mfa/disable',
      enable: 'api/auth/mfa/enable',
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
      active: 'api/users/me/active',
      self: 'api/users/me',
      settings: {
        notifications: 'api/users/me/settings/notifications',
      },
    },
  },
  workspaces: {
    self: 'api/workspaces/',
    workspace: (workspaceId: string) => ({
      awsMarketplaceProduct: `api/workspaces/${workspaceId}/aws_marketplace_product`,
      billing: `api/workspaces/${workspaceId}/billing`,
      billingEntries: `api/workspaces/${workspaceId}/billing_entries/`,
      subscription: {
        item: (subscriptionId: string) => `api/workspaces/${workspaceId}/subscription/${subscriptionId}`,
        stripe: `api/workspaces/${workspaceId}/subscriptions/stripe`,
      },
      cloudAccounts: {
        cloudAccount: (cloudAccountId: string) => ({
          self: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}`,
          enable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/enable`,
          disable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/disable`,
          scan: {
            enable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/scan/enable`,
            disable: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/scan/disable`,
          },
          logs: `api/workspaces/${workspaceId}/cloud_account/${cloudAccountId}/logs`,
        }),
        self: `api/workspaces/${workspaceId}/cloud_accounts`,
        lastScan: `api/workspaces/${workspaceId}/cloud_accounts/lastScan`,
        gcp: {
          key: `api/workspaces/${workspaceId}/cloud_accounts/gcp/key`,
        },
        azure: {
          credentials: `api/workspaces/${workspaceId}/cloud_accounts/azure/credentials`,
        },
      },
      inventory: {
        aggregate: `api/workspaces/${workspaceId}/inventory/aggregate`,
        descendant: {
          summary: `api/workspaces/${workspaceId}/inventory/descendant/summary`,
        },
        history: {
          timeline: `api/workspaces/${workspaceId}/inventory/history/timeline`,
        },
        reportSummary: `api/workspaces/${workspaceId}/inventory/report-summary`,
        report: {
          benchmark: (benchmarkName: string) => ({
            self: `api/workspaces/${workspaceId}/inventory/report/benchmark/${benchmarkName}`,
            result: `api/workspaces/${workspaceId}/inventory/report/benchmark/${benchmarkName}/result`,
          }),
          benchmarks: `api/workspaces/${workspaceId}/inventory/report/benchmarks`,
          check: (checkId: string) => `api/workspaces/${workspaceId}/inventory/report/check/${checkId}`,
          checks: `api/workspaces/${workspaceId}/inventory/report/checks`,
          config: `api/workspaces/${workspaceId}/inventory/report/config`,
          info: `api/workspaces/${workspaceId}/inventory/report/info`,
        },
        search: {
          self: `api/workspaces/${workspaceId}/inventory/search`,
          start: `api/workspaces/${workspaceId}/inventory/search/start`,
          table: `api/workspaces/${workspaceId}/inventory/search/table`,
        },
        model: `api/workspaces/${workspaceId}/inventory/model`,
        node: (nodeId: string) => ({
          self: `api/workspaces/${workspaceId}/inventory/node/${nodeId}`,
          securityIgnore: `api/workspaces/${workspaceId}/inventory/node/${nodeId}/security_ignore`,
          history: `api/workspaces/${workspaceId}/inventory/node/${nodeId}/history`,
          neighborhood: `api/workspaces/${workspaceId}/inventory/node/${nodeId}/neighborhood`,
        }),
        property: {
          attributes: `api/workspaces/${workspaceId}/inventory/property/attributes`,
          values: `api/workspaces/${workspaceId}/inventory/property/values`,
          path: {
            complete: `api/workspaces/${workspaceId}/inventory/property/path/complete`,
          },
        },
        timeseries: `api/workspaces/${workspaceId}/inventory/timeseries`,
        workspaceInfo: `api/workspaces/${workspaceId}/inventory/workspace-info`,
      },
      alerting: {
        settings: `api/workspaces/${workspaceId}/alerting/setting`,
      },
      notification: {
        self: (channel: NotificationChannel) => `api/workspaces/${workspaceId}/notification/${channel}`,
        add: (channel: NotificationChannel) => `api/workspaces/${workspaceId}/notification/add/${channel}`,
        test: (channel: NotificationChannel) => `api/workspaces/${workspaceId}/notification/${channel}/test`,
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
        self: (userId: string) => `api/workspaces/${workspaceId}/users/${userId}/`,
      },
      roles: {
        list: `api/workspaces/${workspaceId}/roles`,
        self: (userId: string) => `api/workspaces/${workspaceId}/roles/${userId}`,
      },
      acceptInvite: `api/workspaces/${workspaceId}/accept_invite`,
      ackMoveToFree: `api/workspaces/${workspaceId}/ack_move_to_free`,
      cfUrl: `api/workspaces/${workspaceId}/cf_url`,
      cfTemplate: `api/workspaces/${workspaceId}/cf_template`,
      externalId: `api/workspaces/${workspaceId}/external_id`,
      events: `api/workspaces/${workspaceId}/events`,
      productTiers: `api/workspaces/${workspaceId}/product_tiers`,
    }),
  },
}
