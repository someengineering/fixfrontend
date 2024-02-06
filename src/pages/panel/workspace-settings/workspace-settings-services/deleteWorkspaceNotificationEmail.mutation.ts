import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationEmailMutation = async ({ workspaceId }: { workspaceId: string }) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.email).then((res) => res.data)
}
