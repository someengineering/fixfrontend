import { endPoints } from 'src/shared/constants'
import { Account } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchAccountDisableMutation = async ({ id, workspaceId }: { id: string; workspaceId: string }) => {
  return axiosWithAuth
    .patch<Account>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.cloudAccount(id).disable)
    .then((res) => res.data)
}
