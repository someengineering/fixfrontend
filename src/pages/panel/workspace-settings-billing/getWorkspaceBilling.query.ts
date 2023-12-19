import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceBillingResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceBillingQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-billing', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceBillingResponse>(endPoints.workspaces.workspace(workspaceId).billing, { signal })
        .then((res) => res.data)
    : ({} as GetWorkspaceBillingResponse)
}
