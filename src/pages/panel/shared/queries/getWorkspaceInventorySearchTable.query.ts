import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventorySearchTableResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventorySearchTableQuery = ({
  signal,
  queryKey: [_, workspaceId, query, skip, limit, count, history],
}: QueryFunctionContext<['workspace-inventory-search-table', string | undefined, string, number, number, boolean, string]>) => {
  return workspaceId
    ? axiosWithAuth
        .post<GetWorkspaceInventorySearchTableResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.search.table,
          { query, skip, limit, count, ...(history ? { history: JSON.parse(history) as Record<string, string> } : {}) },
          { signal },
        )
        .then((res) => [res.data, Number(res.headers['total-count'] || 0)] as const)
    : null
}
