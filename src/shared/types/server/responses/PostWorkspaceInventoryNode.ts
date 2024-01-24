import { FailedCheck, SeverityType } from './shared'

export type WorkspaceInventoryNodeType = 'node' | 'edge'

export interface WorkspaceInventoryNodeNeighborhoodNodeType {
  id: string
  type: 'node'
  metadata: {
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
    reported: Record<string, string | number | boolean | Array<unknown> | Record<string, unknown>> & {
      ctime: string
      name: string
      age: string
      id: string
      kind: string
      tags: Record<string, string>
    }
    security?: {
      issues: {
        benchmark: string
        check: string
        severity: SeverityType
        opened_at: string
        run_id: string
      }[]
      opened_at: string
      reopen_counter: number
      run_id: string
      has_issues: boolean
      severity: SeverityType
    }
    metadata: {
      python_type: string
      cleaned?: boolean
      phantom?: boolean
      protected?: boolean
      replace?: boolean
      exported_at?: string
      descendant_summary?: Record<string, number>
      descendant_count?: number
      exported_age?: string
      provider_link?: string
      [key: string]: unknown
    }
    ancestors?: Record<string, { reported: { name: string; id: string } }>
  }
  neighborhood: WorkspaceInventoryNodeNeighborhood[]
  failing_checks: FailedCheck[]
}

export type PostWorkspaceInventoryNodeResponse = WorkspaceInventoryNode
