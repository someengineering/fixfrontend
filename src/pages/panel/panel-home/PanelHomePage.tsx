import { Trans } from '@lingui/macro'
import { Box, Divider, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceReportSummaryQuery } from 'src/pages/panel/shared-queries'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
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

const HomePage = () => {
  const { selectedWorkspace } = useUserProfile()
  const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('xl'))
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'))
  const { data } = useQuery({
    queryKey: ['workspace-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceReportSummaryQuery,
    enabled: !!selectedWorkspace?.id,
  })

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
        <Grid item xs={12} md={6} lg={8} xl={9}>
          <Typography variant="h3" mb={2}>
            <Trans>Overall</Trans>
          </Typography>
          <OverallCard data={data} />
          {isDesktop ? (
            <>
              <Box p={4}>
                <Divider />
              </Box>
              <Typography variant="h3" mb={2}>
                <Trans>Benchmarks</Trans>
              </Typography>
              {chartToShow(data)}
            </>
          ) : (
            false
          )}
        </Grid>
        {!isMobile ? (
          <Grid item md={6} lg={4} xl={3}>
            <Stack display="flex" direction="row">
              <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} flexItem />
              <Stack>
                <Typography variant="h3" mb={{ xs: 0, md: 2 }} mt={{ xs: 4, md: 0 }}>
                  <Trans>Top 5 Security Enhancements</Trans>
                </Typography>
                <TopFiveChecksCard data={data} />
              </Stack>
            </Stack>
          </Grid>
        ) : (
          false
        )}
      </Grid>
      {!isDesktop ? (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={2}>
            <Trans>Benchmarks</Trans>
          </Typography>
          {chartToShow(data)}
        </>
      ) : (
        false
      )}
      {isMobile ? (
        <>
          <Box p={4}>
            <Divider />
          </Box>
          <Typography variant="h3" mb={{ xs: 0, md: 2 }} mt={{ xs: 4, md: 0 }}>
            <Trans>Top 5 Security Enhancements</Trans>
          </Typography>
          <TopFiveChecksCard data={data} />
        </>
      ) : (
        false
      )}
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3" mb={2}>
        <Trans>Accounts Summary</Trans>
      </Typography>
      <Grid container spacing={2} my={2}>
        {data?.accounts
          .sort((prev, cur) => prev.score - cur.score)
          .map((account) => (
            <Grid item key={account.id} width={300}>
              <AccountCard account={account} />
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default function PanelHomePage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <HomePage />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
