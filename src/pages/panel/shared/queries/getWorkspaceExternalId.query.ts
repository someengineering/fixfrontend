import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceExternalIdResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceExternalIdQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-external-id', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceExternalIdResponse>(endPoints.workspaces.workspace(workspaceId).externalId, { signal })
        .then((res) => res.data.external_id)
    : ''
}
