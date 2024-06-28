import { ProductTier } from 'src/shared/types/server-shared'

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
  move_to_free_acknowledged_at: string | null
  tier: ProductTier
}

export type GetWorkspacesResponse = GetWorkspaceResponse[]
