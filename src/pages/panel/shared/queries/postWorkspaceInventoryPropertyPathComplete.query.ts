import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { defaultProperties } from 'src/shared/fix-query-parser'
import {
  PostWorkspaceInventoryPropertyPathCompleteRequest,
  PostWorkspaceInventoryPropertyPathCompleteResponse,
} from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryPropertyPathCompleteQuery = ({
  signal,
  queryKey: [, workspaceId, path, prop, kind, kinds],
  pageParam: { skip = 0, limit = 50 },
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-path-complete-query',
    string | undefined, // workspaceId
    string, // path
    string, // prop
    string | null, // kind
    string, // kinds
  ],
  {
    skip: number | null
    limit: number | null
  }
>) => {
  const data: PostWorkspaceInventoryPropertyPathCompleteRequest = {
    path,
    prop,
    kinds: kind ? [kind] : (JSON.parse(kinds) as string[]),
    fuzzy: true,
    limit,
    skip,
  }
  return (
    (workspaceId &&
      axiosWithAuth
        .post<PostWorkspaceInventoryPropertyPathCompleteResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.property.path.complete,
          data,
          { signal },
        )
        .then((res) => {
          const data = Object.entries(res.data ?? {}).map(([key, value]) => ({ label: path ? `${path}.${key}` : key, key, value }))
          return (
            path || skip
              ? data
              : (prop ? defaultProperties.filter((i) => i.label.toLowerCase().includes(prop.toLowerCase())) : defaultProperties).concat(
                  data,
                )
          ) as typeof defaultProperties
        })) ||
    null
  )
}
