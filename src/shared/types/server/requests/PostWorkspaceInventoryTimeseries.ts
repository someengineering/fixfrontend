export type PostWorkspaceInventoryTimeseriesRequest = {
  name: string
  start: string
  end: string
  granularity: string
  group?: string[] | null
  filter_group?: string[] | null
  aggregation?: string | null
}
