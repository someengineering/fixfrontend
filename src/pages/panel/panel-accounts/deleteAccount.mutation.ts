import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const deleteAccountMutation = async ({ id, workspaceId }: { id: string; workspaceId: string }) => {
  return axiosWithAuth.delete<string>(endPoints.workspaces.cloudAccount.self(workspaceId, id)).then((res) => res.data)
}
