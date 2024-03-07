export interface WorkspaceInventorySearchStartProperty {
  id: string
  name: string
  cloud: string
}

export interface WorkspaceInventorySearchStart {
  accounts: WorkspaceInventorySearchStartProperty[]
  regions: WorkspaceInventorySearchStartProperty[]
  kinds: WorkspaceInventorySearchStartProperty[]
  severity: string[]
}

export type GetWorkspaceInventorySearchStartResponse = WorkspaceInventorySearchStart
