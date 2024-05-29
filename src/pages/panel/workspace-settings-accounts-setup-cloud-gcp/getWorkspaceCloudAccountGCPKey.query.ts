import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountGCPKeyResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountGCPKeyQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-cloud-account-gcp-key-query', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountGCPKeyResponse>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.gcp.key, {
          signal,
        })
        .then((res) => res.data)
    : ({} as Partial<GetWorkspaceCloudAccountGCPKeyResponse>)
}
