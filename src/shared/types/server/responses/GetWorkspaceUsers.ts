export interface WorkspaceUserRole {
  admin: boolean
  billing_admin: boolean
  member: boolean
  owner: boolean
  user_id: string
  workspace_id: string
}

export interface WorkspaceUser {
  id: string
  sources: { source: string }[]
  name: string
  email: string
  roles: WorkspaceUserRole
  last_login: string | null
}

export type GetWorkspaceUsersResponse = WorkspaceUser[]
