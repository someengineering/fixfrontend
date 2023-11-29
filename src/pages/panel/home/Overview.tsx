import { Trans } from '@lingui/macro'
import { Box, Divider, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceInventoryReportSummaryQuery } from 'src/pages/panel/shared/queries'
import { PieCard, chartToShow, checkDiff } from 'src/pages/panel/shared/utils'
import { colorFromRedToGreen } from 'src/shared/constants'
import { OverallCard } from './OverallCard'
import { OverallScore } from './OverallScore'
import { TopFiveChecksCard } from './TopFiveChecksCard'

export const Overview = () => {
  const { selectedWorkspace } = useUserProfile()
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-inventory-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceInventoryReportSummaryQuery,
  })
  const difference = data ? checkDiff(data) : 0
  const hasDifference = Boolean(difference && !Number.isNaN(difference))
  const positive = difference >= 0
  const overallColor = hasDifference && data ? colorFromRedToGreen[data?.overall_score] : 'info'

  return !data?.benchmarks.length ? (
    <Stack
      display="flex"
      flexGrow={1}
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      maxWidth="800px"
      margin="0 auto"
    >
      <Typography variant="h3" textAlign="center">
        <Trans>Security Scan in Progress</Trans>
      </Typography>
      <Typography variant="h5" mt={2} textAlign="justify">
        <Trans>
          Your cloud account has been added successfully! We are currently performing a security scan. This can take up to an hour depending
          on the size of your account. Your dashboard will be available shortly after the scan is complete.
        </Trans>
      </Typography>
    </Stack>
  ) : (
    <>
      <Grid container my={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" mb={2}>
            <Trans>Changes in the past 7 days</Trans>
          </Typography>
          <OverallCard
            data={data}
            difference={difference}
            isMobile={isMobile}
            hasDifference={hasDifference}
            positive={positive}
            overallColor={overallColor}
          />
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
                  <Trans>Top 5 Security Enhancements</Trans>
                </Typography>
                <TopFiveChecksCard failedChecks={data.top_checks} />
              </Stack>
            </Stack>
          </Grid>
        ) : (
          false
        )}
      </Grid>
      {chartToShow(data)}
      {isMobile ? (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={{ xs: 0, md: 2 }}>
            <Trans>Top 5 Security Enhancements</Trans>
          </Typography>
          <TopFiveChecksCard failedChecks={data.top_checks} />
        </>
      ) : (
        false
      )}
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
