import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { PostWorkspaceInventoryDescendantSummaryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const postWorkspaceInventoryDescendantSummaryQuery = ({
  signal,
  queryKey: [, workspaceId, clouds, accounts, regions, kinds],
}: QueryFunctionContext<
  [
    'workspace-inventory-descendant-summary',
    string | undefined, // workspaceId
    string | undefined, // clouds
    string | undefined, // accounts
    string | undefined, // regions
    string | undefined, // kinds
  ]
>) => {
  const data: { cloud_ids?: string[]; account_ids?: string[]; region_ids?: string[]; kinds?: string[] } = {}
  if (clouds) {
    data.cloud_ids = clouds.split(',')
  }
  if (accounts) {
    data.account_ids = accounts.split(',')
  }
  if (regions) {
    data.region_ids = regions.split(',')
  }
  if (kinds) {
    data.kinds = kinds.split(',')
  }

  return workspaceId
    ? axiosWithAuth
        .post<PostWorkspaceInventoryDescendantSummaryResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.descendant.summary,
          data,
          { signal },
        )
        .then((res) => res.data)
    : ({} as PostWorkspaceInventoryDescendantSummaryResponse)
}
