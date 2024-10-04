import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryTimeseriesRequest, PostWorkspaceInventoryTimeseriesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryTimeseriesQuery = async ({
  signal,
  queryKey: [
    ,
    workspaceId,
    name = 'resources',
    start = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    end = new Date().toISOString(),
    granularity,
    group,
    filter_group,
    aggregation,
  ],
}: QueryFunctionContext<
  [
    'workspace-inventory-timeseries',
    string | undefined, // workspaceId
    string, // name
    string, // start
    string, // end
    string, // granularity
    string | undefined, // group
    string | undefined, // filter_group
    string | undefined, // aggregation
  ]
>) => {
  const defaultTimeSeries = {
    ats: [],
    end,
    start,
    granularity,
    groups: [],
  } as PostWorkspaceInventoryTimeseriesResponse
  if (new Date(start) > new Date(end)) {
    return defaultTimeSeries
  }
  const data: PostWorkspaceInventoryTimeseriesRequest = {
    name,
    start,
    end,
    granularity,
  }
  if (group !== undefined) {
    data.group = group.split(',').filter((i) => i)
  }
  if (filter_group !== undefined) {
    data.filter_group = filter_group.split(',').filter((i) => i)
  }
  if (aggregation !== undefined) {
    data.aggregation = aggregation
  }
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryTimeseriesResponse>(endPoints.workspaces.workspace(workspaceId).inventory.timeseries, data, {
          signal,
        })
        .then((res) => res.data)
    : defaultTimeSeries
}
