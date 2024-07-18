import { QueryFunctionContext } from '@tanstack/react-query'
import { endPoints } from 'src/shared/constants'
import { GetWorkspaceInventoryReportBenchmarksResponse } from 'src/shared/types/server'
import { Benchmark } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

export const getWorkspaceInventoryReportBenchmarksQuery = ({
  signal,
  queryKey: [, workspaceId, benchmark_ids, short, with_checks, ids_only, withError0Result],
}: QueryFunctionContext<
  [
    'workspace-inventory-report-benchmarks',
    string | undefined,
    string | undefined,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined,
  ]
>) => {
  const params: Record<string, string> = {}
  if (benchmark_ids) {
    params.benchmark_ids = benchmark_ids
  }
  if (short !== undefined) {
    params.short = short.toString()
  }
  if (with_checks !== undefined) {
    params.with_checks = with_checks.toString()
  }
  if (ids_only !== undefined) {
    params.ids_only = ids_only.toString()
  }
  return workspaceId
    ? axiosWithAuth
        .get<GetWorkspaceInventoryReportBenchmarksResponse>(endPoints.workspaces.workspace(workspaceId).inventory.report.benchmarks, {
          signal,
          params: Object.keys(params).length ? params : undefined,
        })
        .then((res) => res.data)
        .catch((e) => {
          if (withError0Result) {
            return [] as Benchmark[]
          }
          throw e
        })
    : ([] as Benchmark[])
}
