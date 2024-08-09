import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryHistoryTimelineRequest, PostWorkspaceInventoryHistoryTimelineResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryHistoryTimelineQuery = ({
  signal,
  queryKey: [
    ,
    workspaceId,
    query,
    changes,
    after = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    before = new Date().toISOString(),
    granularity,
  ],
}: QueryFunctionContext<
  [
    'workspace-inventory-history-timeline',
    string | undefined, // workspaceId
    string, // query
    string, // changes
    string, // after
    string, // before
    string | undefined, // granularity
  ]
>) => {
  const data: PostWorkspaceInventoryHistoryTimelineRequest = {
    query,
    after,
    before,
    changes: changes.split(','),
  }
  if (granularity) {
    data.granularity = granularity
  }
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryHistoryTimelineResponse>(endPoints.workspaces.workspace(workspaceId).inventory.history.timeline, data, {
          signal,
        })
        .then((res) => res.data)
    : ([] as PostWorkspaceInventoryHistoryTimelineResponse)
}
