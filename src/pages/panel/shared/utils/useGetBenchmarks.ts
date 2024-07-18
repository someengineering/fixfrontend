import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportBenchmarksQuery } from 'src/pages/panel/shared/queries'
import { Benchmark } from 'src/shared/types/server-shared'

export function useGetBenchmarks(
  select: true,
  ids?: string[] | undefined,
  withError0Result?: boolean,
): { data: Benchmark[] | undefined; isLoading: boolean }
export function useGetBenchmarks(
  select?: false,
  ids?: string[],
  withError0Result?: boolean,
): { data: Record<string, Benchmark | undefined> | undefined; isLoading: boolean }
export function useGetBenchmarks(select: boolean = false, ids: string[] = [], withError0Result?: boolean) {
  const { selectedWorkspace } = useUserProfile()
  const { data, isLoading } = useQuery({
    queryKey: [
      'workspace-inventory-report-benchmarks',
      selectedWorkspace?.id,
      select ? ids.join(',') : undefined,
      true,
      false,
      false,
      withError0Result,
    ],
    queryFn: getWorkspaceInventoryReportBenchmarksQuery,
    gcTime: Number.POSITIVE_INFINITY,
  })
  const result = useMemo(
    () => ({
      data: select
        ? data
        : data
          ? ids.reduce(
              (prev, cur) => ({ ...prev, [cur]: data?.find((item) => item.id === cur) }),
              {} as Record<string, Benchmark | undefined>,
            )
          : undefined,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, JSON.stringify(ids), isLoading, select],
  )
  return result
}
