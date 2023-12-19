import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryPropertyAttributesRequest, PostWorkspaceInventoryPropertyAttributesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryPropertyAttributesQuery = ({
  signal,
  queryKey: [, workspaceId, query = 'all', prop = 'tags'],
  pageParam: { skip, limit },
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-attributes',
    string | undefined, // workspaceId
    string | null, // query
    string | null, // prop
  ],
  {
    skip: number | null
    limit: number | null
  }
>) => {
  const data: PostWorkspaceInventoryPropertyAttributesRequest = `query=${window.encodeURIComponent(
    query ?? '',
  )}&prop=${window.encodeURIComponent(prop ?? '')}`
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryPropertyAttributesResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.attributes,
          data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            signal,
            params: {
              skip,
              limit,
            },
          },
        )
        .then((res) => res.data)
    : null
}
