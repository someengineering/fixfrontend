import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceUsersResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceUsersQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-users', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceUsersResponse>(endPoints.workspaces.workspace(workspaceId).users.list, { signal })
        .then((res) => res.data)
    : ([] as GetWorkspaceUsersResponse)
}
