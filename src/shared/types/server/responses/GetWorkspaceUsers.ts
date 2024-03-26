import { UserRole } from './shared'

export interface WorkspaceUser {
  id: string
  sources: { source: string }[]
  name: string
  email: string
  roles: UserRole
  last_login: string | null
}

export type GetWorkspaceUsersResponse = WorkspaceUser[]
