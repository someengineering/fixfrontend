import { LiteralUnion } from 'src/shared/types/shared'

export interface WorkspaceInfoResourcePerAccountTimelineGroup {
  group_name: string
  group?: LiteralUnion<{ account_id: string }, Record<string, string>>
  values: Record<string, number>
  attributes?: LiteralUnion<{ name: string }, Record<string, string>>
}

export interface WorkspaceInfoResourcePerAccountTimeline {
  start: string
  end: string
  granularity: string
  ats: string[]
  groups: WorkspaceInfoResourcePerAccountTimelineGroup[]
}

export interface GetWorkspaceInventoryWorkspaceInfoResponse {
  resources_per_account_timeline: WorkspaceInfoResourcePerAccountTimeline
  score_progress: [number, number]
  resource_changes: [number, number, number]
  instances_progress: [number, number]
  cores_progress: [number, number]
  memory_progress: [number, number]
  volumes_progress: [number, number]
  volume_bytes_progress: [number, number]
  databases_progress: [number, number]
  databases_bytes_progress: [number, number]
  buckets_objects_progress: [number, number]
  buckets_size_bytes_progress: [number, number]
}
