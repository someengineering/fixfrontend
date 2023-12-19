import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceBillingEntriesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceBillingEntriesQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-billing-entries', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceBillingEntriesResponse>(endPoints.workspaces.workspace(workspaceId).billingEntries, { signal })
        .then((res) => res.data)
    : ([] as GetWorkspaceBillingEntriesResponse)
}
