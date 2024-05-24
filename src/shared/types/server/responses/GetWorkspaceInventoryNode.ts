import { FailedCheck, NodeAncestors, NodeMetadata, NodeReported, NodeSecurity, NodeType } from 'src/shared/types/server-shared'

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
  checks: FailedCheck[]
}

export type GetWorkspaceInventoryNodeResponse = WorkspaceInventoryNode
