import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryWorkspaceInfoResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryWorkspaceInfoQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-workspace-info', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryWorkspaceInfoResponse>(endPoints.workspaces.workspace(workspaceId).inventory.workspaceInfo, { signal })
        .then((res) => res.data)
    : ({
        resources_per_account_timeline: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          granularity: 'P1D',
          ats: [],
          groups: [],
        },
        score_progress: [100, 0],
        resource_changes: [0, 0, 0],
        instances_progress: [0, 0],
        cores_progress: [0, 0],
        memory_progress: [0, 0],
        volumes_progress: [0, 0],
        volume_bytes_progress: [0, 0],
        databases_progress: [0, 0],
        databases_bytes_progress: [0, 0],
        buckets_objects_progress: [0, 0],
        buckets_size_bytes_progress: [0, 0],
      } as GetWorkspaceInventoryWorkspaceInfoResponse)
}
