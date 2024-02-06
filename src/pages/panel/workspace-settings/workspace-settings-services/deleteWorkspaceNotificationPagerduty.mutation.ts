import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationPagerdutyMutation = async ({ workspaceId }: { workspaceId: string }) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.pagerduty).then((res) => res.data)
}
