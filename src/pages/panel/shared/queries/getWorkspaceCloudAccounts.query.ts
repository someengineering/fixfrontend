import { QueryFunctionContext } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountsQuery = async ({
  signal,
  queryKey: [, workspaceId, noError],
}: QueryFunctionContext<['workspace-cloud-accounts', string | undefined, boolean | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountsResponse>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.self, { signal })
        .then((res) => res.data)
        .catch((e: AxiosError<{ detail: string }>) => {
          if (noError) return e.response?.data.detail
          throw e
        })
    : ({ added: [], discovered: [], recent: [] } as GetWorkspaceCloudAccountsResponse)
}
