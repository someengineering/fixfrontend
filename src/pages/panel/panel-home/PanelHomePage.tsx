import { Trans } from '@lingui/macro'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getWorkspaceReportSummaryQuery } from '../shared-queries/getWorkspaceReportSummary.query'
import { AccountCard } from './AccountCard'
import { HeatmapCard } from './HeatmapCard'
import { OverallCard } from './OverallCard'
import { PieCard } from './PieCard'
import { StackBarCard } from './StackBarCard'
import { TopFiveChecksCard } from './TopFiveChecksCard'

const chartToShow = (data?: GetWorkspaceInventoryReportSummaryResponse) => {
  if (data) {
    const benchmarksLength = data.benchmarks.length
    const accountLength = data.accounts.length
    if (accountLength && benchmarksLength) {
      if (
        (benchmarksLength === 2 && accountLength > 8) ||
        (benchmarksLength > 2 && benchmarksLength < 5 && accountLength > 4) ||
        (benchmarksLength > 4 && benchmarksLength < 9 && accountLength > 2) ||
        (benchmarksLength > 8 && accountLength > 1)
      ) {
        return <HeatmapCard data={data} />
      } else if (
        (benchmarksLength === 1 && accountLength > 8) ||
        (benchmarksLength === 2 && accountLength > 4 && accountLength < 9) ||
        (benchmarksLength > 2 && benchmarksLength < 5 && accountLength > 2 && accountLength < 5) ||
        (benchmarksLength > 4 && benchmarksLength < 9 && accountLength === 2) ||
        (benchmarksLength > 8 && accountLength === 1)
      ) {
        return <StackBarCard data={data} />
      }
      return <PieCard data={data} />
    }
  }
  return null
}

export default function HomePage() {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery(['workspace-report-summary', selectedWorkspace?.id], getWorkspaceReportSummaryQuery, {
    enabled: !!selectedWorkspace?.id,
  })

  return (
    <>
      <Typography variant="h3" mb={2}>
        <Trans>Overall</Trans>
      </Typography>
      <OverallCard data={data} />
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3" mb={2}>
        <Trans>Benchmarks</Trans>
      </Typography>
      {chartToShow(data)}
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3" mb={2}>
        <Trans>Accounts</Trans>
      </Typography>
      <Grid container spacing={2} my={2}>
        {data?.accounts.map((item) => (
          <Grid item key={item.id} minWidth={300}>
            <AccountCard account={item} />
          </Grid>
        ))}
      </Grid>
      <TopFiveChecksCard data={data} />
    </>
  )
}
