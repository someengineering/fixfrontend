import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventorySearchForDashboardResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventorySearchForDashboardQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-search-for-dashboard', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventorySearchForDashboardResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.search.self,
          { query: 'is(account)', with_edges: false },
          { signal },
        )
        .then((res) => res.data)
    : ([] as PostWorkspaceInventorySearchForDashboardResponse)
}
