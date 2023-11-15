import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceCfUrlResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceCfUrlQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-cf-url', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth.get<GetWorkspaceCfUrlResponse>(endPoints.workspaces.workspace(workspaceId).cfUrl, { signal }).then((res) => res.data)
    : undefined
}
