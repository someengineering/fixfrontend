export interface GetWorkspaceResponse {
  id: string
  slug: string
  name: string
  owners: string[]
  members: string[]
  on_hold_since: string | null
  created_at: string
  trial_end_days: number | null
}

export type GetWorkspacesResponse = GetWorkspaceResponse[]
