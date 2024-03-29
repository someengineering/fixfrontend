import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import {
  PostWorkspaceInventorySearchTableRequest,
  PostWorkspaceInventorySearchTableResponse,
  WorkspaceInventorySearchTableHistory,
  WorkspaceInventorySearchTableSort,
} from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventorySearchTableQuery = ({
  signal,
  queryKey: [, workspaceId, query, skip, limit, count, sort, history],
}: QueryFunctionContext<['workspace-inventory-search-table', string | undefined, string, number, number, boolean, string, string]>) => {
  const data: PostWorkspaceInventorySearchTableRequest = {
    ...(history ? { history: JSON.parse(history) as WorkspaceInventorySearchTableHistory } : {}),
    ...(sort ? { sort: JSON.parse(sort) as WorkspaceInventorySearchTableSort[] } : {}),
    count,
    limit,
    query,
    skip,
  }
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventorySearchTableResponse>(endPoints.workspaces.workspace(workspaceId).inventory.search.table, data, {
          signal,
        })
        .then((res) => [res.data, Number(res.headers['total-count'] || 0)] as const)
    : null
}
