export interface Account {
  id: string
  cloud: string
  account_id: string
  enabled: boolean
  scan: boolean
  is_configured: boolean
  resources: number | null
  next_scan: string | null
  user_account_name: string | null
  api_account_alias: string | null
  api_account_name: string | null
  state: string
  privileged: boolean
  last_scan_started_at: string | null
  last_scan_finished_at: string | null
  cf_stack_version: number | null
}
