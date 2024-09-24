import { AccountCloud } from 'src/shared/types/server-shared'

export interface PostWorkspaceInventoryAggregateForDashboardItem {
  group: {
    cloud: AccountCloud
    name: string
    long_name: string
    latitude: number
    longitude: number
  }
  resource_count: number
}

export type PostWorkspaceInventoryAggregateForDashboardResponse = PostWorkspaceInventoryAggregateForDashboardItem[]
