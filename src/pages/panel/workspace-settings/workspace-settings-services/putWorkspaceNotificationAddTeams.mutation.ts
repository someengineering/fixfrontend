import { endPoints } from 'src/shared/constants'
import { PutWorkspaceNotificationAddTeamsRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceNotificationAddTeamsMutation = async ({
  workspaceId,
  ...params
}: PutWorkspaceNotificationAddTeamsRequest & { workspaceId: string }) => {
  return axiosWithAuth
    .put<undefined>(endPoints.workspaces.workspace(workspaceId).notification.add.teams, null, {
      params,
    })
    .then((res) => res.data)
}
