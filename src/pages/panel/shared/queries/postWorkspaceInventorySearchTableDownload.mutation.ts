import { AxiosProgressEvent } from 'axios'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventorySearchTableRequest } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

type PostWorkspaceInventorySearchTableDownloadRequestParams = {
  limit?: number
  signal: AbortSignal
  workspaceId: string
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void
} & Omit<PostWorkspaceInventorySearchTableRequest, 'count' | 'skip' | 'limit'>

export const postWorkspaceInventorySearchTableDownloadMutation = async ({
  signal,
  workspaceId,
  onDownloadProgress,
  limit = 1000,
  ...data
}: PostWorkspaceInventorySearchTableDownloadRequestParams) => {
  return workspaceId
    ? axiosWithAuth.post<Blob>(
        endPoints.workspaces.workspace(workspaceId).inventory.search.table,
        { ...data, limit },
        {
          headers: { Accept: 'text/csv' },
          responseType: 'blob',
          signal,
          onDownloadProgress,
        },
      )
    : null
}
