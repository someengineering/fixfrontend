import { endPoints } from 'src/shared/constants'
import { Account } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchAccountMutation = async ({ id, name, workspaceId }: { id: string; name: string | null; workspaceId: string }) => {
  return axiosWithAuth
    .patch<Account>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.cloudAccount(id).self, { name })
    .then((res) => res.data)
}
