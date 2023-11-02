import { endPoints } from 'src/shared/constants'
import { Account } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const renameAccountMutation = async ({ id, name, workspaceId }: { id: string; name: string; workspaceId: string }) => {
  return axiosWithAuth.patch<Account>(endPoints.workspaces.cloudAccount.self(workspaceId, id), { name }).then((res) => res.data)
}
