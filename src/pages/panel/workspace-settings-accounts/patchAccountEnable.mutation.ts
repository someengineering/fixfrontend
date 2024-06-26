import { endPoints } from 'src/shared/constants'
import { Account } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchAccountEnableMutation = async ({ id, workspaceId }: { id: string; workspaceId: string }) => {
  return axiosWithAuth
    .patch<Account>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.cloudAccount(id).enable)
    .then((res) => res.data)
}
