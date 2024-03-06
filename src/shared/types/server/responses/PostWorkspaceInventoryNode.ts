import { FailedCheck, NodeAncestors, NodeMetadata, NodeReported, NodeSecurity } from './shared'

export type WorkspaceInventoryNodeType = 'node' | 'edge'

export interface WorkspaceInventoryNodeNeighborhoodNodeType {
  id: string
  type: 'node'
  metadata?: {
    icon?: string
    group?: string
    name?: string
  }
  age?: string
  tags: Record<string, string>
  reported: {
    id: string
    kind: string
    name: string
  }
}

export interface WorkspaceInventoryNodeNeighborhoodEdgeType {
  type: 'edge'
  from: string
  to: string
}

export type WorkspaceInventoryNodeNeighborhood = WorkspaceInventoryNodeNeighborhoodNodeType | WorkspaceInventoryNodeNeighborhoodEdgeType

export interface WorkspaceInventoryNode {
  resource: {
    id: string
    type: WorkspaceInventoryNodeType
    revision: string
    reported: NodeReported
    security?: NodeSecurity
    metadata: NodeMetadata
    ancestors?: NodeAncestors
  }
  neighborhood: WorkspaceInventoryNodeNeighborhood[]
  failing_checks: FailedCheck[]
}

export type PostWorkspaceInventoryNodeResponse = WorkspaceInventoryNode
