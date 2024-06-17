import { endPoints } from 'src/shared/constants'
import { PutWorkspaceCloudAccountAzureCredentialsRequest, PutWorkspaceCloudAccountAzureCredentialsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceCloudAccountAzureKeyMutation = ({
  workspaceId,
  ...data
}: PutWorkspaceCloudAccountAzureCredentialsRequest & {
  workspaceId: string
}) => {
  return axiosWithAuth.put<PutWorkspaceCloudAccountAzureCredentialsResponse>(
    endPoints.workspaces.workspace(workspaceId).cloudAccounts.azure.credentials,
    data,
  )
}
