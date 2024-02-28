import { ResourceComplexKindSimpleTypeDefinitions } from './shared'

export interface PostWorkspaceInventorySearchTableRow {
  id: string
  row: Record<string, string | number | boolean | null>
}

export interface PostWorkspaceInventorySearchTableColumn {
  name: string
  kind: ResourceComplexKindSimpleTypeDefinitions
  path: string
  display: string
}

export type PostWorkspaceInventorySearchTableResponse = [
  { columns: PostWorkspaceInventorySearchTableColumn[] },
  ...PostWorkspaceInventorySearchTableRow[],
]
