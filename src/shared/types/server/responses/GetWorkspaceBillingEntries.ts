import { ProductTier } from 'src/shared/types/server-shared'

export interface WorkspaceBillingEntry {
  id: string
  workspace_id: string
  subscription_id: string
  tier: ProductTier
  period_start: string
  period_end: string
  nr_of_accounts_charged: number
}

export type GetWorkspaceBillingEntriesResponse = WorkspaceBillingEntry[]
