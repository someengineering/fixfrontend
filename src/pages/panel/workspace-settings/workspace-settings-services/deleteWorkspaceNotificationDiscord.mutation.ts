import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationDiscordMutation = async ({ workspaceId }: { workspaceId: string }) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.discord).then((res) => res.data)
}
