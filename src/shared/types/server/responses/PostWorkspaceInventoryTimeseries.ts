export interface PostWorkspaceInventoryTimeseriesItem {
  attributes: Record<string, never>
  values: Record<string, number>
  group: {
    account_id: string
    cloud_id: string
    kind: string
  }
}

export interface PostWorkspaceInventoryTimeseriesResponse {
  start: string
  end: string
  granularity: string
  ats: string[]
  groups: PostWorkspaceInventoryTimeseriesItem[]
}
