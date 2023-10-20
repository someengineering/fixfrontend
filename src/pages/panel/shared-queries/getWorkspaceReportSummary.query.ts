import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceReportSummaryQuery = ({
  signal,
  queryKey: [_, workspaceId],
}: QueryFunctionContext<['workspace-report-summary', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportSummaryResponse>(endPoints.workspaces.inventory.reportSummary(workspaceId) + 'f', { signal })
        .then((res) => res.data)
    : undefined
}
