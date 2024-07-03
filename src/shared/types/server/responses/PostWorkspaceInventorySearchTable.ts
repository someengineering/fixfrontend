import { ResourceComplexKindSimpleTypeDefinitions } from 'src/shared/types/server-shared'

export interface WorkspaceInventorySearchTableDefaultRow {
  kind: string
  id: string
  name: string
  has_issues: boolean
  check: string | null
  age: string
  last_update: string
  cloud: string | null
  account: string | null
  region: string | null
  zone: string | null
}

export interface WorkspaceInventorySearchTableRow {
  id: string
  row: WorkspaceInventorySearchTableDefaultRow & Record<string, string | number | boolean | null>
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
