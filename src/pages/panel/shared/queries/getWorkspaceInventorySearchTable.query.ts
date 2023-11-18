import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventorySearchTableResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventorySearchTableQuery = ({
  signal,
  queryKey: [_, workspaceId, searchCrit],
}: QueryFunctionContext<['workspace-inventory-search-table', string | undefined, string]>) => {
  return workspaceId
    ? axiosWithAuth
        .post<GetWorkspaceInventorySearchTableResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.search.table,
          `query=${window.encodeURIComponent(searchCrit)}`,
          {
            signal,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .then((res) => res.data)
    : null
}
