export type PostWorkspaceInventorySearchTableHistory = {
  before: string | null
  after: string | null
  change: string | null
}

export type PostWorkspaceInventorySearchTableRequest = {
  query: string
  history?: PostWorkspaceInventorySearchTableHistory | null
  skip: number
  limit: number
  count: boolean
}
