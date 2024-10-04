import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryAggregateForDashboardResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryAggregateForDashboardQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-aggregate-for-dashboard', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryAggregateForDashboardResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.aggregate,
          {
            query:
              'aggregate(/ancestors.cloud.reported.name as cloud, name, long_name, latitude, longitude: sum(/metadata.descendant_count) as resource_count): is(region) and latitude!=null and /metadata.descendant_count>0',
          },
          {
            signal,
          },
        )
        .then((res) => res.data)
    : ([] as PostWorkspaceInventoryAggregateForDashboardResponse)
}
