import { QueryFunctionContext } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountGCPKeyResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountGCPKeyQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-cloud-account-gcp-key', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountGCPKeyResponse>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.gcp.key, {
          signal,
        })
        .then((res) => res.data)
        .catch(
          (res?: AxiosError<GetWorkspaceCloudAccountGCPKeyResponse>) =>
            ({
              can_access_sa:
                res?.response?.status === 422
                  ? res?.response?.data?.can_access_sa === undefined
                    ? false
                    : res.response.data.can_access_sa
                  : false,
              created_at: res?.response?.data?.created_at ?? '',
              id: res?.response?.data?.id ?? '',
              workspace_id: res?.response?.data?.workspace_id ?? workspaceId,
            }) as GetWorkspaceCloudAccountGCPKeyResponse,
        )
    : ({
        can_access_sa: false,
        created_at: '',
        id: '',
        workspace_id: workspaceId,
      } as GetWorkspaceCloudAccountGCPKeyResponse)
}
