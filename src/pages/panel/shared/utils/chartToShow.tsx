import { Trans } from '@lingui/macro'
import { Box, Divider, Typography } from '@mui/material'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { HeatmapCard } from './HeatmapCard'

export const chartToShow = (data?: GetWorkspaceInventoryReportSummaryResponse) => {
  if (data) {
    const accountLength = data.accounts.length
    if (accountLength && accountLength > 1) {
      return (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={2}>
            <Trans>Benchmarks</Trans>
          </Typography>
          <HeatmapCard data={data} />
        </>
      )
    }
  }
}
