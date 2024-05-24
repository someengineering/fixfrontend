import { OAuthProviderNames } from 'src/shared/types/server-shared'

export interface OAuthProviderResponse {
  name: OAuthProviderNames
  authUrl: string
}

export type GetOAuthProvidersResponse = OAuthProviderResponse[]
