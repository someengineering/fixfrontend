import { ResourceComplexKindSimpleTypeDefinitions } from './shared'

export interface GetWorkspaceInventorySearchTableRow {
  id: string
  row: Record<string, string | number | boolean | null>
}

export interface GetWorkspaceInventorySearchTableColumn {
  name: string
  kind: ResourceComplexKindSimpleTypeDefinitions
  display: string
}

export type GetWorkspaceInventorySearchTableResponse = [
  { columns: GetWorkspaceInventorySearchTableColumn[] },
  ...GetWorkspaceInventorySearchTableRow[],
]
