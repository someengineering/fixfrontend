import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryPropertyAttributesQuery = ({
  signal,
  queryKey: [_, workspaceId, query = 'all', prop = 'tags'],
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
  return workspaceId
    ? axiosWithAuth
        .post<string[]>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.attributes,
          `query=${window.encodeURIComponent(query ?? '')}&prop=${window.encodeURIComponent(prop ?? '')}`,
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