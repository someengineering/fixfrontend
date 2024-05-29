import { AxiosProgressEvent } from 'axios'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const putWorkspaceCloudAccountGCPKeyMutation = ({
  file,
  workspaceId,
  onUploadProgress,
}: {
  file: File
  workspaceId: string
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
}) => {
  const formData = new FormData()
  formData.append('service_account_key', file)
  return axiosWithAuth.put(endPoints.workspaces.workspace(workspaceId).cloudAccounts.gcp.key, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}
