import { QueryFunctionContext } from '@tanstack/react-query'
import { defaultProperties } from 'src/pages/panel/shared/constants'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryPropertyPathComplete } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryPropertyPathCompleteQuery = ({
  signal,
  queryKey: [_, workspaceId, path, prop, kind],
  pageParam: { skip = 0, limit = 50 },
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-path-complete-query',
    string | undefined, // workspaceId
    string, // path
    string, // prop
    string | null, // kind
  ],
  {
    skip: number | null
    limit: number | null
  }
>) => {
  const data = {
    path,
    prop,
    kinds: kind ? [kind] : [],
    fuzzy: 0,
    limit,
    skip,
  }
  return (
    (workspaceId &&
      axiosWithAuth
        .post<GetWorkspaceInventoryPropertyPathComplete>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.path.complete,
          data,
          { signal },
        )
        .then((res) => {
          const data = Object.entries(res.data ?? {}).map(([key, value]) => ({ label: path ? `${path}.${key}` : key, key, value }))
          return (path || prop || skip ? data : defaultProperties.concat(data)) as typeof defaultProperties
        })) ||
    null
  )
}
