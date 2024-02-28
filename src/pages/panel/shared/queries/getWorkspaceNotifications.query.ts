import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceNotificationsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceNotificationsQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-notifications', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceNotificationsResponse>(endPoints.workspaces.workspace(workspaceId).notification.list, { signal })
        .then((res) => res.data)
    : ({} as GetWorkspaceNotificationsResponse)
}
