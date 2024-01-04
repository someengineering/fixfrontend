import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceSubscriptionMutation = async ({
  workspaceId,
  subscriptionId,
}: {
  workspaceId: string
  subscriptionId: string
}) => {
  return workspaceId
    ? axiosWithAuth.put<string>(endPoints.workspaces.workspace(workspaceId).subscription(subscriptionId)).then((res) => res.data)
    : null
}
