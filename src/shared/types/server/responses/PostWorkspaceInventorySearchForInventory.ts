import { NodeAncestors, NodeMetadata, NodeReported, NodeSecurity } from 'src/shared/types/server-shared'

export interface PostWorkspaceInventorySearchForInventoryItem {
  id: string
  type: 'node'
  ancestors: NodeAncestors
  revision: string
  reported: NodeReported
  metadata: NodeMetadata
  security: NodeSecurity
}

export type PostWorkspaceInventorySearchForInventoryResponse = PostWorkspaceInventorySearchForInventoryItem[]
