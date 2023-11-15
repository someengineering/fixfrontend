import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryPropertyAttributesQuery = ({
  signal,
  queryKey: [_, workspaceId, skip = 0, limit = 10, query = 'all', prop = 'tags'],
}: QueryFunctionContext<
  [
    'workspace-inventory-property-attributes',
    string | undefined, // workspaceId
    number | undefined, // skip
    number | undefined, // limit
    string | undefined, // query
    string | undefined, // prop
  ]
>) => {
  return workspaceId
    ? axiosWithAuth
        .post<string[]>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.attributes,
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
        .then((res) => res.data)
    : undefined
}
