import { endPoints } from 'src/shared/constants'
import { GetWorkspaceSettingsResponse, PatchWorkspaceSettingsRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const patchWorkspaceSettingsMutation = async ({ workspaceId, ...body }: PatchWorkspaceSettingsRequest & { workspaceId: string }) => {
  return workspaceId
    ? axiosWithAuth.patch<GetWorkspaceSettingsResponse>(endPoints.workspaces.workspace(workspaceId).settings, body).then((res) => res.data)
    : ({} as GetWorkspaceSettingsResponse)
}
