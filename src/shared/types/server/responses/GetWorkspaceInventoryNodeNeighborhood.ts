import { EdgeType, NodeType } from 'src/shared/types/server-shared'

export type WorkspaceInventoryNodeNeighborhoodNodeType = NodeType<{
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
}>

export type WorkspaceInventoryNodeNeighborhood = WorkspaceInventoryNodeNeighborhoodNodeType | EdgeType

export type GetWorkspaceInventoryNodeNeighborhoodResponse = WorkspaceInventoryNodeNeighborhood[]
