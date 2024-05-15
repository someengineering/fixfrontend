import { NodeAncestors, NodeMetadata, NodeReported, NodeSecurity, SeverityType } from './shared'

export type WorkspaceInventoryNodeHistoryChanges = 'node_created' | 'node_updated' | 'node_deleted' | 'node_vulnerable' | 'node_compliant'

export type WorkspaceInventoryNodeHistoryDiff = {
  check: string
  severity: SeverityType
  opened_at: string
  benchmarks: string[]
}

type WorkspaceInventoryNodeHistoryBase = {
  id: string
  type: 'node'
  revision: string
  reported: NodeReported
  metadata: NodeMetadata
  ancestors?: NodeAncestors
  change: WorkspaceInventoryNodeHistoryChanges
  changed_at: string
  created: string
  updated: string
}

interface WorkspaceInventoryNodeCreatedHistory extends WorkspaceInventoryNodeHistoryBase {
  change: 'node_created' | 'node_deleted'
}

interface WorkspaceInventoryNodeUpdatedHistory extends WorkspaceInventoryNodeHistoryBase {
  change: 'node_updated'
  before: NodeReported
}

interface WorkspaceInventoryNodeSecurityHistory extends WorkspaceInventoryNodeHistoryBase {
  change: 'node_vulnerable' | 'node_compliant'
  security: NodeSecurity
  diff: {
    node_compliant?: WorkspaceInventoryNodeHistoryDiff[]
    node_vulnerable?: WorkspaceInventoryNodeHistoryDiff[]
  }
}

export type WorkspaceInventoryNodeHistory =
  | WorkspaceInventoryNodeCreatedHistory
  | WorkspaceInventoryNodeUpdatedHistory
  | WorkspaceInventoryNodeSecurityHistory

export type GetWorkspaceInventoryNodeHistoryResponse = WorkspaceInventoryNodeHistory[]
