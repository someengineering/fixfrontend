export type PostWorkspaceInventoryHistoryTimelineRequest = {
  query: string
  before: string
  after: string
  changes: string[]
  granularity?: string
}
