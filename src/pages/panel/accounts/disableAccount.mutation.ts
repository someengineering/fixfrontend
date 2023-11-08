import { endPoints } from 'src/shared/constants'
import { Account } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const disableAccountMutation = async ({ id, workspaceId }: { id: string; workspaceId: string }) => {
  return axiosWithAuth.patch<Account>(endPoints.workspaces.cloudAccount.disable(workspaceId, id)).then((res) => res.data)
}
