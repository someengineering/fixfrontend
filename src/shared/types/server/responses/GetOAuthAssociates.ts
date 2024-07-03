import { OAuthProviderNames } from 'src/shared/types/server-shared'

export interface OAuthAssociateResponse {
  account_email: string | null
  name: OAuthProviderNames
  associated: boolean
  account_id: string | null
  authUrl: string
}

export type GetOAuthAssociatesResponse = OAuthAssociateResponse[]
