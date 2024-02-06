import { endPoints } from 'src/shared/constants'
import { PutWorkspaceNotificationAddPagerdutyRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceNotificationAddPagerdutyMutation = async ({
  workspaceId,
  ...params
}: PutWorkspaceNotificationAddPagerdutyRequest & { workspaceId: string }) => {
  return axiosWithAuth
    .put<undefined>(endPoints.workspaces.workspace(workspaceId).notification.add.pagerduty, null, {
      params,
    })
    .then((res) => res.data)
}
