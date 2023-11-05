export interface GetWorkspaceResponse {
  id: string
  slug: string
  name: string
  owners: string[]
  members: string[]
}

export type GetWorkspacesResponse = GetWorkspaceResponse[]
