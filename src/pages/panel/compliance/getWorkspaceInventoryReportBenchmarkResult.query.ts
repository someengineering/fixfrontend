import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportBenchmarkResultResponse } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportBenchmarkResultQuery = ({
  signal,
  queryKey: [, workspaceId, benchmark_id, accounts, severity, only_failing],
}: QueryFunctionContext<
  [
    'workspace-inventory-report-benchmark-result',
    string | undefined,
    string | undefined,
    string | undefined,
    SeverityType | undefined,
    boolean | undefined,
  ]
>) => {
  const params: {
    accounts?: string
    severity?: SeverityType
    only_failing?: string
  } = {}
  if (accounts) {
    params.accounts = accounts
  }
  if (severity) {
    params.severity = severity
  }
  if (only_failing !== undefined) {
    params.only_failing = only_failing.toString()
  }
  return workspaceId && benchmark_id
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportBenchmarkResultResponse>(
          endPoints.workspaces.workspace(workspaceId).inventory.report.benchmark(benchmark_id).result,
          { signal, params },
        )
        .then((res) => res.data)
    : ([] as GetWorkspaceInventoryReportBenchmarkResultResponse)
}
