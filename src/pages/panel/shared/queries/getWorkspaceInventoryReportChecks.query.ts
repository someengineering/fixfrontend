import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { FailedCheck, GetWorkspaceInventoryReportChecksResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportChecksQuery = ({
  signal,
  queryKey: [, workspaceId, check_ids],
}: QueryFunctionContext<['workspace-inventory-report-checks', string | undefined, string]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportChecksResponse>(endPoints.workspaces.workspace(workspaceId).inventory.report.checks, {
          signal,
          params: { check_ids },
        })
        .then((res) => res.data)
    : ([] as FailedCheck[])
}
