export type WorkspaceInvite = {
  workspace_id: string
  workspace_name: string
  user_email: string
  expires_at: string
  accepted_at: string | null
}

export type GetWorkspaceInvitesResponse = WorkspaceInvite[]
