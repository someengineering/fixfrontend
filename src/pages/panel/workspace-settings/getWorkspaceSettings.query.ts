import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceSettingsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceSettingsQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-settings', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceSettingsResponse>(endPoints.workspaces.workspace(workspaceId).settings, { signal })
        .then((res) => res.data)
    : ({} as GetWorkspaceSettingsResponse)
}
