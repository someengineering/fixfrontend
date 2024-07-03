import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportChecksQuery } from 'src/pages/panel/shared/queries'
import { useGetBenchmarks } from 'src/pages/panel/shared/utils'
import { WorkspaceInventoryNodeSecurityHistory } from 'src/shared/types/server'
import { FailedCheck } from 'src/shared/types/server-shared'
import { ResourceDetailChangeLogSelectedHistoryAccordion } from './ResourceDetailChangeLogSelectedHistoryAccordion'

export const ResourceDetailChangeLogSelectedHistoryDiff = ({
  node_compliant = [],
  node_vulnerable = [],
}: WorkspaceInventoryNodeSecurityHistory['diff']) => {
  const { selectedWorkspace } = useUserProfile()
  const { checkIds, benchmarksIds } = useMemo(
    () => ({
      checkIds: [...node_compliant.map(({ check }) => check), ...node_vulnerable.map(({ check }) => check)].join(','),
      benchmarksIds: [...node_compliant.map(({ benchmarks }) => benchmarks), ...node_vulnerable.map(({ benchmarks }) => benchmarks)].flat(),
    }),
    [node_compliant, node_vulnerable],
  )
  const { data } = useQuery({
    queryKey: ['workspace-inventory-report-checks', selectedWorkspace?.id, checkIds],
    queryFn: getWorkspaceInventoryReportChecksQuery,
    select: (data) => {
      return {
        node_compliant: node_compliant.reduce(
          (prev, { check }) => ({ ...prev, [check]: data.find((item) => item.id === check) }),
          {} as Record<string, FailedCheck | undefined>,
        ),
        node_vulnerable: node_vulnerable.reduce(
          (prev, { check }) => ({ ...prev, [check]: data.find((item) => item.id === check) }),
          {} as Record<string, FailedCheck | undefined>,
        ),
      }
    },
  })
  const { data: benchmarks } = useGetBenchmarks(false, benchmarksIds)
  return (
    <Stack>
      {node_compliant.length ? (
        <>
          <Stack py={1}>
            <Typography variant="h5">
              <Trans>Fixed issues</Trans>
            </Typography>
          </Stack>
          {node_compliant.map((item, i) => (
            <ResourceDetailChangeLogSelectedHistoryAccordion
              data={item}
              benchmarks={item.benchmarks.map((id) => benchmarks?.[id]?.title ?? id)}
              title={data?.node_compliant?.[item.check]?.title}
              key={i}
            />
          ))}
        </>
      ) : null}
      {node_vulnerable.length ? (
        <>
          <Stack py={1} spacing={1}>
            <Typography variant="h5">
              <Trans>New issues</Trans>
            </Typography>
          </Stack>
          {node_vulnerable.map((item, i) => (
            <ResourceDetailChangeLogSelectedHistoryAccordion
              data={item}
              benchmarks={item.benchmarks.map((id) => benchmarks?.[id]?.title ?? id)}
              title={data?.node_vulnerable?.[item.check]?.title}
              isVulnerable
              key={i}
            />
          ))}
        </>
      ) : null}
    </Stack>
  )
}
