import { WorkspaceInventoryNodeHistoryChanges } from './GetWorkspaceInventoryNodeHistory'

export interface PostWorkspaceInventoryHistoryTimelineItem {
  at: string
  group: {
    change: WorkspaceInventoryNodeHistoryChanges
  }
  v: number
}

export type PostWorkspaceInventoryHistoryTimelineResponse = PostWorkspaceInventoryHistoryTimelineItem[]
