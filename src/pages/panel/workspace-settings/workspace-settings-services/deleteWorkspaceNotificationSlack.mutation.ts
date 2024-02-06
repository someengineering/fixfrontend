import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationSlackMutation = async ({ workspaceId }: { workspaceId: string }) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.slack).then((res) => res.data)
}
