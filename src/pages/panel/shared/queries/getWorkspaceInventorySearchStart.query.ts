import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventorySearchStartResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventorySearchStartQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-inventory-search-start', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventorySearchStartResponse>(endPoints.workspaces.workspace(workspaceId).inventory.search.start, { signal })
        .then((res) => res.data)
    : undefined
}
