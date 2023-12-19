export type WorkspaceUser = {
  id: string
  sources: string[]
  name: string
  email: string
  roles: string[]
  last_login: string | null
}

export type GetWorkspaceUsersResponse = WorkspaceUser[]
