export interface ApiTokenItem {
  name: string
  workspace_id: string | null
  permission: number | null
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export type GetApiTokenResponse = ApiTokenItem[]
