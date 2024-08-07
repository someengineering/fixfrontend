import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

const getDefaultValue = () =>
  ({
    account_check_summary: {
      available_resources: 0,
      failed_resources_by_severity: {},
    },
    accounts: [],
    benchmarks: [],
    changed_compliant: {
      accounts_selection: [],
      resource_count_by_kind_selection: {},
      resource_count_by_severity: {},
      since: '',
    },
    changed_vulnerable: {
      accounts_selection: [],
      resource_count_by_kind_selection: {},
      resource_count_by_severity: {},
      since: '',
    },
    check_summary: {
      available_resources: 0,
      failed_resources_by_severity: {},
    },
    overall_score: 0,
    top_checks: [],
    vulnerable_resources: null,
  }) as GetWorkspaceInventoryReportSummaryResponse

export const getWorkspaceInventoryReportSummaryQuery = ({
  signal,
  queryKey: [, workspaceId],
}: QueryFunctionContext<['workspace-inventory-report-summary', string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportSummaryResponse>(endPoints.workspaces.workspace(workspaceId).inventory.reportSummary, { signal })
        .then((res) => res.data)
    : getDefaultValue()
}
