import { UserRole } from 'src/shared/types/server-shared'

export interface WorkspaceUser {
  id: string
  sources: { source: string }[]
  name: string
  email: string
  roles: UserRole
  last_login: string | null
}

export type GetWorkspaceUsersResponse = WorkspaceUser[]
