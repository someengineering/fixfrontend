export type HistoryChanges = 'node_created' | 'node_updated' | 'node_deleted' | 'node_vulnerable' | 'node_compliant'

export type WorkspaceInventorySearchTableHistory = {
  before?: string | null
  after?: string | null
  changes: HistoryChanges[]
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
