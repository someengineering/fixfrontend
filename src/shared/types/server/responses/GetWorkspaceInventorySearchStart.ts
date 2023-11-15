export interface GetWorkspaceInventorySearchStartProperty {
  id: string
  name: string
  cloud: string
}

export interface GetWorkspaceInventorySearchStart {
  accounts: GetWorkspaceInventorySearchStartProperty[]
  regions: GetWorkspaceInventorySearchStartProperty[]
  kinds: GetWorkspaceInventorySearchStartProperty[]
  severity: string[]
}

export type GetWorkspaceInventorySearchStartResponse = GetWorkspaceInventorySearchStart
