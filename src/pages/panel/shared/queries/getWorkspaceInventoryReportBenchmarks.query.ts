import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { Benchmark, GetWorkspaceInventoryReportBenchmarksResponse } from 'src/shared/types/server'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportBenchmarksQuery = ({
  signal,
  queryKey: [, workspaceId, benchmark_ids],
}: QueryFunctionContext<['workspace-inventory-report-benchmarks', string | undefined, string | undefined]>) => {
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportBenchmarksResponse>(endPoints.workspaces.workspace(workspaceId).inventory.report.benchmarks, {
          signal,
          params: benchmark_ids ? { benchmark_ids } : null,
        })
        .then((res) => res.data)
    : ([] as Benchmark[])
}
