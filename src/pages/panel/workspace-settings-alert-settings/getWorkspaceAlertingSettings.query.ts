import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceAlertingSettingsResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceAlertingSettingsQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-alerting-settings', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceAlertingSettingsResponse>(endPoints.workspaces.workspace(workspaceId).alerting.settings, { signal })
        .then((res) => res.data)
    : ({} as GetWorkspaceAlertingSettingsResponse)
}
