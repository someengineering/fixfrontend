export interface GetWorkspaceResponse {
  id: string
  slug: string
  name: string
  owners: string[]
  members: unknown[]
}

export type GetWorkspacesResponse = GetWorkspaceResponse[]
