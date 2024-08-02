import { ProductTier } from 'src/shared/types/server-shared'

export interface GetWorkspaceProductTier {
  // retention_period: string
  // seats_included: number
  seats_max: number | null
  scan_interval: string
  account_limit: number | null
  accounts_included: number
  price_per_account_cents: number
}

export type GetWorkspaceProductTiersResponse = Record<ProductTier, GetWorkspaceProductTier>
