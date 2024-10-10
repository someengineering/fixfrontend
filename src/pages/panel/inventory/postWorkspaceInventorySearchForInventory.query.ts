import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventorySearchForInventoryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventorySearchForInventoryQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-search-for-inventory', string | undefined]>) => {
  return workspaceId
    ? Promise.all([
        axiosWithAuth
          .post<PostWorkspaceInventorySearchForInventoryResponse>(
            endPoints.workspaces.workspace(workspaceId).inventory.search.self,
            { query: 'is(account) and /metadata.descendant_count>0', with_edges: false },
            { signal },
          )
          .then((res) => res.data),
        axiosWithAuth
          .post<PostWorkspaceInventorySearchForInventoryResponse>(
            endPoints.workspaces.workspace(workspaceId).inventory.search.self,
            { query: 'is(region) and /metadata.descendant_count>0', with_edges: false },
            { signal },
          )
          .then((res) => res.data),
      ])
    : ([[], []] as [PostWorkspaceInventorySearchForInventoryResponse, PostWorkspaceInventorySearchForInventoryResponse])
}
