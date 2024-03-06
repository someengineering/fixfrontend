import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryNodeHistoryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryNodeHistoryQuery = ({
  signal,
  queryKey: [, workspaceId, nodeId, before, after, changes, limit],
}: QueryFunctionContext<
  [
    'workspace-inventory-node-history',
    string | undefined, // workspaceId
    string | undefined, // nodeId
    string | undefined, // before
    string | undefined, // after
    string | undefined, // changes
    number | undefined, // limit
  ]
>) => {
  return workspaceId && nodeId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryNodeHistoryResponse>(endPoints.workspaces.workspace(workspaceId).inventory.node(nodeId).history, {
          signal,
          params: {
            before,
            after,
            changes,
            limit,
          },
        })
        .then((res) => res.data)
    : null
}
