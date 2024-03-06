import { NodeAncestors, NodeMetadata, NodeReported, NodeSecurity, SeverityType } from './shared'

export type PostWorkspaceInventoryNodeHistoryChanges =
  | 'node_created'
  | 'node_updated'
  | 'node_deleted'
  | 'node_vulnerable'
  | 'node_compliant'

export type PostWorkspaceInventoryNodeHistoryDiff = {
  check: string
  severity: SeverityType
  opened_at: string
  benchmarks: string[]
}

export interface PostWorkspaceInventoryNodeHistory<NodeChange = PostWorkspaceInventoryNodeHistoryChanges> {
  id: string
  type: 'node'
  revision: string
  reported: NodeReported
  before: NodeChange extends 'node_updated' ? NodeReported : never
  security: NodeChange extends 'node_vulnerable' | 'node_compliant' ? NodeSecurity : never
  metadata: NodeMetadata
  diff: NodeChange extends 'node_vulnerable' | 'node_compliant'
    ? {
        node_compliant: PostWorkspaceInventoryNodeHistoryDiff[]
        node_vulnerable: PostWorkspaceInventoryNodeHistoryDiff[]
      }
    : never
  ancestors?: NodeAncestors
  change: NodeChange
  changed_at: string
  created: string
  updated: string
}

export type PostWorkspaceInventoryNodeHistoryResponse = PostWorkspaceInventoryNodeHistory[]
