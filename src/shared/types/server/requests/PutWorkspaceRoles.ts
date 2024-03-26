export type PutWorkspaceRolesRequest = {
  admin?: boolean
  billing_admin?: boolean
  member?: boolean
  owner?: boolean
  user_id: string
  user_email?: string
}
