import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceProductTiersResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceProductTiersQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-product-tiers', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceProductTiersResponse>(endPoints.workspaces.workspace(workspaceId).productTiers, { signal })
        .then((res) => res.data)
    : ({} as GetWorkspaceProductTiersResponse)
}
