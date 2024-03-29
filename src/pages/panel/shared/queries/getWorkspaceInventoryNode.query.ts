import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryNodeResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryNodeQuery = ({
  signal,
  queryKey: [, workspaceId, nodeId],
}: QueryFunctionContext<['workspace-inventory-node', string | undefined, string | undefined]>) => {
  return workspaceId && nodeId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryNodeResponse>(endPoints.workspaces.workspace(workspaceId).inventory.node(nodeId).self, { signal })
        .then((res) => res.data)
    : null
}
