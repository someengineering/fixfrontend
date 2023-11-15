import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetExternalIdResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getExternalIdQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-external-id', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetExternalIdResponse>(endPoints.workspaces.workspace(workspaceId).externalId, { signal })
        .then((res) => res.data.external_id)
    : undefined
}
