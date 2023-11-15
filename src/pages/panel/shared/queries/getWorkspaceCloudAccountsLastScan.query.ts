import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCloudAccountsLastScanResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCloudAccountsLastScanQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-cloud-accounts-last-scan', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceCloudAccountsLastScanResponse>(endPoints.workspaces.workspace(workspaceId).cloudAccounts.lastScan, { signal })
        .then((res) => res.data)
    : undefined
}
