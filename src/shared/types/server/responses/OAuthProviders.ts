export type OAuthProviderNames = 'google' | 'github'

export interface OAuthProviderResponse {
  name: OAuthProviderNames
  authUrl: string
}

export type OAuthProvidersResponse = OAuthProviderResponse[]
