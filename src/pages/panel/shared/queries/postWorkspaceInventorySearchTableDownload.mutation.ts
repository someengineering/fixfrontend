import { AxiosProgressEvent } from 'axios'
import { endPoints } from 'src/shared/constants'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventorySearchTableDownloadMutation = async ({
  signal,
  query,
  workspaceId,
  onDownloadProgress,
}: {
  signal: AbortSignal
  workspaceId: string
  query: string
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void
}) => {
  return workspaceId
    ? axiosWithAuth.post<Blob>(
        endPoints.workspaces.workspace(workspaceId).inventory.search.table,
        { query, limit: 1000 },
        { headers: { Accept: 'text/csv' }, responseType: 'blob', signal, onDownloadProgress },
      )
    : null
}
