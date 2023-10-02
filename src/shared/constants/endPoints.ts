export const endPoints = {
  auth: {
    jwt: {
      logout: '/api/auth/jwt/logout',
    },
    oauthProviders: '/api/auth/oauth-providers',
  },
  organizations: {
    get: '/api/organizations/',
    cf_url: (organizationId: string) => `/api/organizations/${organizationId}/cf_url`,
    externalId: (organizationId: string) => `/api/organizations/${organizationId}/external_id`,
  },
}
