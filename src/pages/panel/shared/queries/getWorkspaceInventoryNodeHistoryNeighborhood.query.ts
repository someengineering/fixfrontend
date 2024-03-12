import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryNodeNeighborhoodResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryNodeHistoryNeighborhoodQuery = ({
  signal,
  queryKey: [, workspaceId, nodeId],
}: QueryFunctionContext<
  [
    'workspace-inventory-node-neighborhood',
    string | undefined, // workspaceId
    string | undefined, // nodeId
  ]
>) => {
  return workspaceId && nodeId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryNodeNeighborhoodResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.node(nodeId).neighborhood,
          {
            signal,
          },
        )
        .then((res) => res.data)
    : null
}
