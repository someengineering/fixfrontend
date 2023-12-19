import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryPropertyValuesRequest, PostWorkspaceInventoryPropertyValuesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryPropertyValuesQuery = ({
  signal,
  queryKey: [, workspaceId, query = 'all', prop = 'tags'],
  pageParam: { skip, limit },
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-values',
    string | undefined, // workspaceId
    string | undefined, // query
    string | undefined, // prop
  ],
  {
    skip: number | undefined
    limit: number | undefined
  }
>) => {
  const data: PostWorkspaceInventoryPropertyValuesRequest = `query=${window.encodeURIComponent(query)}&prop=${window.encodeURIComponent(
    prop,
  )}`
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryPropertyValuesResponse>(endPoints.workspaces.workspace(workspaceId).inventory.property.values, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          signal,
          params: {
            skip,
            limit,
          },
        })
        .then((res) => res.data.map((i) => i.toString()))
    : null
}
