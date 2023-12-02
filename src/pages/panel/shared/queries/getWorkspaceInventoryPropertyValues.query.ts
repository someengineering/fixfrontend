import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryPropertyValuesQuery = ({
  signal,
  queryKey: [_, workspaceId, query = 'all', prop = 'tags'],
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
  return workspaceId
    ? axiosWithAuth
        .post<string[]>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.values,
          `query=${window.encodeURIComponent(query)}&prop=${window.encodeURIComponent(prop)}`,
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
        .then((res) => res.data.map((i) => i.toString()))
    : null
}
