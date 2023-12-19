export interface WorkspaceBillingEntry {
  id: string
  workspace_id: string
  subscription_id: string
  tier: 'FreeAccount' | 'FoundationalSecurityAccount' | 'HighSecurityAccount'
  period_start: string
  period_end: string
  nr_of_accounts_charged: number
}

export type GetWorkspaceBillingEntriesResponse = WorkspaceBillingEntry[]
