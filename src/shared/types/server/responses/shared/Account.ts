export interface Account {
  id: string
  cloud: string
  account_id: string
  name: string | null
  enabled: boolean
  is_configured: boolean
  resources: number | null
  next_scan: string | null
}
