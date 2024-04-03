import { Trans } from '@lingui/macro'
import { Box, Divider, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportSummaryQuery } from 'src/pages/panel/shared/queries'
import { PieCard, chartToShow } from 'src/pages/panel/shared/utils'
import { OverallCard } from './OverallCard'
import { OverallScore } from './OverallScore'
import { TopFiveChecksCard } from './TopFiveChecksCard'
import { VulnerableResourcesTimeline } from './VulnerableResourcesTimeline'

export const Overview = () => {
  const { selectedWorkspace } = useUserProfile()
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-inventory-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceInventoryReportSummaryQuery,
  })

  return (
    <>
      <Grid container my={2}>
        {isMobile ? (
          <Grid item xs={12}>
            <Stack display="flex" direction="row">
              <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} flexItem />
              <Stack width="100%">
                <Typography variant="h3" mb={{ xs: 2 }}>
                  <Trans>Security Score</Trans>
                </Typography>
                <OverallScore
                  score={data.overall_score}
                  failedChecks={data.check_summary.failed_checks_by_severity}
                  failedResources={data.check_summary.failed_resources_by_severity}
                  availableResources={data.check_summary.available_resources}
                />
              </Stack>
            </Stack>
          </Grid>
        ) : null}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" mb={2}>
            <Trans>Changes in the past 7 days</Trans>
          </Typography>
          <OverallCard data={data} />
        </Grid>
        {!isMobile ? (
          <Grid item md={6}>
            <Stack display="flex" direction="row">
              <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} flexItem />
              <Stack>
                <Typography variant="h3" mb={{ xs: 0, md: 2 }} mt={{ xs: 4, md: 0 }}>
                  <Trans>Security Score</Trans>
                </Typography>
                <OverallScore
                  score={data.overall_score}
                  failedChecks={data.check_summary.failed_checks_by_severity}
                  failedResources={data.check_summary.failed_resources_by_severity}
                  availableResources={data.check_summary.available_resources}
                />
                <Divider />
                <Typography variant="h3" mt={{ xs: 0, md: 2 }}>
                  <Trans>Top Security Enhancements</Trans>
                </Typography>
                <TopFiveChecksCard failedChecks={data.top_checks} />
              </Stack>
            </Stack>
          </Grid>
        ) : (
          false
        )}
      </Grid>
      {isMobile ? (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={{ xs: 0, md: 2 }}>
            <Trans>Top Security Enhancements</Trans>
          </Typography>
          <TopFiveChecksCard failedChecks={data.top_checks} />
        </>
      ) : (
        false
      )}
      {chartToShow(data)}
      {data.vulnerable_resources ? (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={2}>
            <Trans>Failing Check Timeline</Trans>
          </Typography>
          <Grid item>
            <VulnerableResourcesTimeline data={data.vulnerable_resources} />
          </Grid>
        </>
      ) : null}
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3">
        <Trans>Accounts Summary</Trans>
      </Typography>
      <PieCard data={data} />
      {/* <Grid container spacing={2} my={2}>
        {data?.accounts
          .sort((prev, cur) => prev.score - cur.score)
          .map((account, i) => (
            <Grid item key={`${account.id}_${i}`} width={300}>
              <AccountCard account={account} />
            </Grid>
          ))}
      </Grid> */}
    </>
  )
}
