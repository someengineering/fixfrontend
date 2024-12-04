import { Trans } from '@lingui/macro'
import { Stack, stackClasses, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportSummaryQuery } from 'src/pages/panel/shared/queries'
import { Heatmap } from 'src/shared/charts'
import { ComplianceSummary } from './ComplianceSummary'

export default function CompliancePage() {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-inventory-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceInventoryReportSummaryQuery,
    select: (data) =>
      data.benchmarks.map((benchmark) => ({
        title: benchmark.title,
        titleHref: `/compliance/${benchmark.id}`,
        cells: data.accounts.map((account) => {
          const failedChecks = benchmark.account_summary[account.id]?.failed_checks
          const allFailedChecks = failedChecks ? Object.values(failedChecks).reduce((sum, current) => sum + current, 0) : -1
          const percentage = failedChecks ? ((benchmark.nr_of_checks - allFailedChecks) * 100) / benchmark.nr_of_checks : -1
          return {
            name: account.name ?? account.id,
            value: percentage,
            title: Math.round(percentage) + '%',
            href: `/compliance/${benchmark.id}/${account.id}`,
          }
        }),
      })),
  })

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h3">
          <Trans>Benchmarks</Trans>
        </Typography>
        <Stack>
          <Stack
            sx={{ overflowX: 'auto', [`&.${stackClasses.root}`]: { ml: -3 } }}
            width={({ spacing }) => `calc(100% + ${spacing(6)})`}
            p={3}
            justifyContent="center"
            alignItems="center"
          >
            <Heatmap data={data} />
          </Stack>
        </Stack>
        <ComplianceSummary />
      </Stack>
    </>
  )
}
