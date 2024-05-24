import { NodeType } from 'src/shared/types/server-shared'

export interface WorkspaceInventoryNodeNeighborhoodNodeType {
  id: string
  type: NodeType
  metadata?: {
    icon?: string
    group?: string
    name?: string
    'state-icon'?: 'instance_terminated'
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

export type GetWorkspaceInventoryNodeNeighborhoodResponse = WorkspaceInventoryNodeNeighborhood[]
