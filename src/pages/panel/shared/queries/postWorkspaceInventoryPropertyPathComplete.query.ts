import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import {
  PostWorkspaceInventoryPropertyPathCompleteRequest,
  PostWorkspaceInventoryPropertyPathCompleteResponse,
} from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryPropertyPathCompleteQuery = ({
  signal,
  queryKey: [, workspaceId, path, prop, kinds],
  pageParam: { skip = 0, limit = 50 },
}: QueryFunctionContext<
  readonly [
    'workspace-inventory-property-path-complete',
    string | undefined, // workspaceId
    string, // path
    string, // prop
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
    kinds: JSON.parse(kinds) as string[],
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
        .then((res) => Object.entries(res.data ?? {}).map(([key, value]) => ({ label: path ? `${path}.${key}` : key, key, value })))) ||
    null
  )
}
