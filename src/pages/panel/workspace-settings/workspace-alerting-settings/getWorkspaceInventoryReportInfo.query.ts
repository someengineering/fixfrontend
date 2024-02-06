import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportInfoResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportInfoQuery = async ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-report-info', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportInfoResponse>(endPoints.workspaces.workspace(workspaceId).inventory.report.info, { signal })
        .then((res) => res.data)
    : ({ benchmarks: [], checks: [] } as GetWorkspaceInventoryReportInfoResponse)
}
