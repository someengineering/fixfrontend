export type PostWorkspaceInventoryPropertyPathCompleteRequest = {
  path?: string
  prop: string
  kinds?: string[]
  fuzzy?: boolean
  limit: number | null
  skip: number | null
}
