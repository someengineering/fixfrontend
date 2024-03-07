export type WorkspaceInventorySearchTableHistory = {
  before: string | null
  after: string | null
  change: string | null
}

export type WorkspaceInventorySearchTableSort = {
  path: string
  direction: 'asc' | 'desc'
}

export type PostWorkspaceInventorySearchTableRequest = {
  query: string
  history?: WorkspaceInventorySearchTableHistory | null
  skip: number
  limit: number
  count: boolean
  sort?: WorkspaceInventorySearchTableSort[]
}
