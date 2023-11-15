import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportSummaryQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-inventory-report-summary', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportSummaryResponse>(endPoints.workspaces.workspace(workspaceId).inventory.reportSummary, { signal })
        .then((res) => res.data)
    : undefined
}
