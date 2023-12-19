import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInvitesResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInvitesQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-invites', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInvitesResponse>(endPoints.workspaces.workspace(workspaceId).invites.list, { signal })
        .then((res) => res.data)
    : ([] as GetWorkspaceInvitesResponse)
}
