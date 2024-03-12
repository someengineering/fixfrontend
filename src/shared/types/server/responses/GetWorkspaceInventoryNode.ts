import { FailedCheck, NodeAncestors, NodeMetadata, NodeReported, NodeSecurity, NodeType } from './shared'

export interface WorkspaceInventoryNode {
  resource: {
    id: string
    type: NodeType
    revision: string
    reported: NodeReported
    security?: NodeSecurity
    metadata: NodeMetadata
    ancestors?: NodeAncestors
  }
  failing_checks: FailedCheck[]
}

export type GetWorkspaceInventoryNodeResponse = WorkspaceInventoryNode
