import { endPoints } from 'src/shared/constants'
import { PatchWorkspaceInventoryNodeSecurityIgnoreRequest, WorkspaceInventoryNode } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchWorkspaceInventoryNodeSecurityIgnoreQuery = ({
  data,
  nodeId,
  workspaceId,
}: {
  data: PatchWorkspaceInventoryNodeSecurityIgnoreRequest
  workspaceId: string
  nodeId: string
}) => {
  return axiosWithAuth
    .patch<WorkspaceInventoryNode['resource']>(endPoints.workspaces.workspace(workspaceId).inventory.node(nodeId).securityIgnore, data)
    .then((res) => res.data)
}
