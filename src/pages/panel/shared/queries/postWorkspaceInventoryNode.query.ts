import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryNodeResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryNodeQuery = ({
  signal,
  queryKey: [, workspaceId, nodeId],
}: QueryFunctionContext<['workspace-inventory-node', string | undefined, string | undefined]>) => {
  return workspaceId && nodeId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryNodeResponse>(endPoints.workspaces.workspace(workspaceId).inventory.node(nodeId), null, { signal })
        .then((res) => res.data)
    : null
}
