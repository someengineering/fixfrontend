export interface GetWorkspaceResponse {
  id: string
  slug: string
  name: string
  owners: string[]
  members: string[]
  on_hold_since: string | null
  created_at: string
  trial_end_days: number | null
  user_has_access: boolean | null
  user_permissions: number
}

export type GetWorkspacesResponse = GetWorkspaceResponse[]
