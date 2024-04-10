import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportBenchmarksQuery } from 'src/pages/panel/shared/queries'
import { Benchmark } from 'src/shared/types/server'

export function useGetBenchmarks(ids: string[], select: true): Benchmark[] | undefined
export function useGetBenchmarks(ids?: string[], select?: false): Record<string, Benchmark | undefined> | undefined
export function useGetBenchmarks(ids: string[] = [], select: boolean = false) {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery({
    queryKey: ['workspace-inventory-report-benchmarks', selectedWorkspace?.id, select ? ids.join(',') : undefined],
    queryFn: getWorkspaceInventoryReportBenchmarksQuery,
    gcTime: Number.POSITIVE_INFINITY,
  })
  return select
    ? data
    : data
      ? ids.reduce((prev, cur) => ({ ...prev, [cur]: data?.find((item) => item.id === cur) }), {} as Record<string, Benchmark | undefined>)
      : undefined
}
