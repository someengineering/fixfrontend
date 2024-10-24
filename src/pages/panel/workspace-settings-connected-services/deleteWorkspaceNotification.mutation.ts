import { endPoints } from 'src/shared/constants'
import { NotificationChannel } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceNotificationMutation = async ({
  workspaceId,
  channel,
}: {
  workspaceId: string
  channel: NotificationChannel
}) => {
  return axiosWithAuth.delete<undefined>(endPoints.workspaces.workspace(workspaceId).notification.self(channel)).then((res) => res.data)
}
