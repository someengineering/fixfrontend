import { endPoints } from 'src/shared/constants'
import { NotificationChannel } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceNotificationTestMutation = async ({
  workspaceId,
  channel,
}: {
  workspaceId: string
  channel: NotificationChannel
}) => {
  return axiosWithAuth.post<undefined>(endPoints.workspaces.workspace(workspaceId).notification.test(channel)).then((res) => res.data)
}
