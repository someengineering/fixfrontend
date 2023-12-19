import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountsQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-cloud-accounts', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountsResponse>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.self, { signal })
        .then((res) => res.data) ?? []
    : { added: [], discovered: [], recent: [] }
}
