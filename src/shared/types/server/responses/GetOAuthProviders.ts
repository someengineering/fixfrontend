import { OAuthProviderNames } from './shared'

export interface OAuthProviderResponse {
  name: OAuthProviderNames
  authUrl: string
}

export type GetOAuthProvidersResponse = OAuthProviderResponse[]
