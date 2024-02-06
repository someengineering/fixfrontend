import { endPoints } from 'src/shared/constants'
import { PutWorkspaceNotificationAddEmailRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceNotificationAddEmailMutation = async ({
  workspaceId,
  ...params
}: PutWorkspaceNotificationAddEmailRequest & { workspaceId: string }) => {
  return axiosWithAuth
    .put<undefined>(
      `${endPoints.workspaces.workspace(workspaceId).notification.add.email}?name=${params.name}&email=${params.email.join('&email=')}`,
    )
    .then((res) => res.data)
}
