import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteWorkspaceUserMutation = async ({ userId, workspaceId }: { userId: string; workspaceId: string }) => {
  return axiosWithAuth.delete<string>(endPoints.workspaces.workspace(workspaceId).users.self(userId)).then((res) => res.data)
}
