import { endPoints } from 'src/shared/constants'
import { PutWorkspaceAlertingSettingsRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceAlertingSettingsQuery = async ({
  workspaceId,
  body,
}: {
  workspaceId: string
  body: PutWorkspaceAlertingSettingsRequest
}) => {
  return axiosWithAuth.put<undefined>(endPoints.workspaces.workspace(workspaceId).alerting.settings, body).then((res) => res.data)
}
