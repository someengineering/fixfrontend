import { Trans } from '@lingui/macro'
import { Box, Divider, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { HeatmapCard } from './HeatmapCard'

export const chartToShow = (data?: GetWorkspaceInventoryReportSummaryResponse) => {
  let chart: ReactNode
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
        chart = <HeatmapCard data={data} />
        // } else if (
        //   (benchmarksLength === 1 && accountLength > 8) ||
        //   (benchmarksLength === 2 && accountLength > 4 && accountLength < 9) ||
        //   (benchmarksLength > 2 && benchmarksLength < 5 && accountLength > 2 && accountLength < 5) ||
        //   (benchmarksLength > 4 && benchmarksLength < 9 && accountLength === 2) ||
        //   (benchmarksLength > 8 && accountLength === 1)
        // ) {
        //   chart = <StackBarCard data={data} />
        // } else {
        //   chart = <PieCard data={data} />
      }
    }
  }
  return chart ? (
    <>
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3" mb={2}>
        <Trans>Benchmarks</Trans>
      </Typography>
      {chart}
    </>
  ) : null
}
