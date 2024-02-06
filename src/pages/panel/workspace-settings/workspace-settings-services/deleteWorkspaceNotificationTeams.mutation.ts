import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationTeamsMutation = async ({ workspaceId }: { workspaceId: string }) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.teams).then((res) => res.data)
}
