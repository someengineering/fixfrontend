import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventorySearchTableResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventorySearchTableQuery = ({
  signal,
  queryKey: [_, workspaceId, query, skip, limit],
}: QueryFunctionContext<['workspace-inventory-search-table', string | undefined, string, number, number]>) => {
  return workspaceId
    ? axiosWithAuth
        .post<GetWorkspaceInventorySearchTableResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.search.table,
          { query, skip, limit },
          { signal },
        )
        .then((res) => res.data)
    : null
}
