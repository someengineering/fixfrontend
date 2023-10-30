import { Trans } from '@lingui/macro'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { useQueries } from '@tanstack/react-query'
import { Suspense, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceReportSummaryQuery } from 'src/pages/panel/shared-queries'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared-queries/getWorkspaceCloudAccounts.query'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getInitiated } from 'src/shared/utils/localstorage'
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
  const [{ data }, { data: accounts }] = useQueries({
    queries: [
      {
        queryKey: ['workspace-report-summary', selectedWorkspace?.id],
        queryFn: getWorkspaceReportSummaryQuery,
        enabled: !!selectedWorkspace?.id,
      },
      {
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id],
        queryFn: getWorkspaceCloudAccountsQuery,
        enabled: !!selectedWorkspace?.id,
      },
    ],
  })
  const navigate = useNavigate()

  const goToSetupCloudPage = useCallback(() => {
    navigate('/setup-cloud')
  }, [navigate])

  useEffect(() => {
    if (!accounts?.length && !getInitiated()) {
      goToSetupCloudPage()
    }
  }, [accounts?.length, goToSetupCloudPage])

  return accounts && !accounts.length ? (
    <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h3">
        <Trans>There's no account configured for this workspace.</Trans>
      </Typography>
      <Typography variant="h5">
        <Trans>
          Please go to{' '}
          <Button variant="text" onClick={goToSetupCloudPage}>
            Setup Accounts
          </Button>{' '}
          page to setup your account first
        </Trans>
      </Typography>
    </Stack>
  ) : accounts?.length && !data?.benchmarks.length ? (
    <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h3">
        <Trans>Please wait and be patient...</Trans>
      </Typography>
      <Typography variant="h5">
        <Trans>The account has been successfully configured but the first benchmark will be run and then you will have the overview.</Trans>
      </Typography>
    </Stack>
  ) : (
    <>
      <Grid container my={2}>
        <Grid item xs={12} sm={12} md={6} lg={8} xl={9}>
          <Typography variant="h3" mb={2}>
            <Trans>Overall</Trans>
          </Typography>
          <OverallCard data={data} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Stack display="flex" direction="row">
            <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} flexItem />
            <Stack>
              <Typography variant="h3" mb={2}>
                <Trans>Top 5 Security Enhancements</Trans>
              </Typography>
              <TopFiveChecksCard data={data} />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
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
        {accounts?.map((account) => (
          <Grid item key={account.id} minWidth={300}>
            <AccountCard account={account} score={data?.accounts.find((item) => item.id === account.id)?.score} />
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
