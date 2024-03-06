import { ResourceComplexKindSimpleTypeDefinitions } from './shared'

export interface WorkspaceInventorySearchTableRow {
  id: string
  row: Record<string, string | number | boolean | null>
}

export interface WorkspaceInventorySearchTableColumn {
  name: string
  kind: ResourceComplexKindSimpleTypeDefinitions
  path: string
  display: string
}

export type PostWorkspaceInventorySearchTableResponse = [
  { columns: WorkspaceInventorySearchTableColumn[] },
  ...WorkspaceInventorySearchTableRow[],
]
