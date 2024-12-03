import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportSummaryQuery } from 'src/pages/panel/shared/queries'
import { HeatmapCard } from 'src/pages/panel/shared/utils'
import { ComplianceSummary } from './ComplianceSummary'

export default function CompliancePage() {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-inventory-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceInventoryReportSummaryQuery,
  })
  const { benchmarkId } = useParams<'benchmarkId'>()

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h3" mb={2}>
          <Trans>Benchmarks</Trans>
        </Typography>
        <HeatmapCard data={data} />
        {benchmarkId ? <ComplianceSummary /> : null}
      </Stack>
    </>
  )
}
