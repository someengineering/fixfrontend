import { endPoints } from 'src/shared/constants'
import { GetWorkspaceSettingsResponse, PutWorkspaceBillingRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceBillingMutation = async ({ workspaceId, ...body }: PutWorkspaceBillingRequest & { workspaceId: string }) => {
  return workspaceId
    ? axiosWithAuth.put<GetWorkspaceSettingsResponse>(endPoints.workspaces.workspace(workspaceId).billing, body).then((res) => res.data)
    : ({} as GetWorkspaceSettingsResponse)
}
