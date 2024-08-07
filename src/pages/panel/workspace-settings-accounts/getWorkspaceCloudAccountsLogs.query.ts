import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountsLogsQuery = async ({
  signal,
  queryKey: [, workspaceId, accountId],
}: QueryFunctionContext<['workspace-cloud-accounts-logs', string | undefined, string | undefined]>) => {
  return workspaceId && accountId
    ? axiosWithAuth
        .get<string[]>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.cloudAccount(accountId).logs, { signal })
        .then((res) => res.data)
    : ([] as string[])
}
