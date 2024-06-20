import { QueryFunctionContext } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountAzureCredentialsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountAzureCredentialsQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-cloud-account-azure-credentials', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountAzureCredentialsResponse>(
          endPoints.workspaces.workspace(workspaceId).cloudAccounts.azure.credentials,
          {
            signal,
          },
        )
        .then((res) => res.data)
        .catch(
          (res?: AxiosError<GetWorkspaceCloudAccountAzureCredentialsResponse>) =>
            ({
              can_access_azure_account:
                res?.response?.status === 422
                  ? res?.response?.data?.can_access_azure_account === undefined
                    ? false
                    : res.response.data.can_access_azure_account
                  : false,
              created_at: res?.response?.data?.created_at ?? '',
              id: res?.response?.data?.id ?? '',
              workspace_id: res?.response?.data?.workspace_id ?? workspaceId,
            }) as GetWorkspaceCloudAccountAzureCredentialsResponse,
        )
    : ({
        can_access_azure_account: false,
        created_at: '',
        id: '',
        workspace_id: workspaceId,
      } as GetWorkspaceCloudAccountAzureCredentialsResponse)
}
