import { Trans } from '@lingui/macro'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceReportSummaryQuery } from 'src/pages/panel/shared-queries'
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

export default function HomePage() {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery({
    queryKey: ['workspace-report-summary', selectedWorkspace?.id],
    queryFn: getWorkspaceReportSummaryQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const navigate = useNavigate()

  const goToSetupCloudPage = useCallback(() => {
    navigate('/setup-cloud')
  }, [navigate])

  useEffect(() => {
    if (!data?.accounts.length && !getInitiated()) {
      goToSetupCloudPage()
    }
  }, [data?.accounts.length, goToSetupCloudPage])

  return data?.accounts && !data.accounts.length ? (
    <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h3">There's no account configed for this workspace.</Typography>
      <Typography variant="h5">
        <Trans>
          Please go to{' '}
          <Button variant="text" onClick={goToSetupCloudPage}>
            <Trans>Setup Accounts</Trans>
          </Button>{' '}
          page to setup your account first
        </Trans>
      </Typography>
    </Stack>
  ) : data?.accounts.length && !data.benchmarks.length ? (
    <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h3">Please wait and be patient...</Typography>
      <Typography variant="h5">
        <Trans>The account has been successfully configured but the first benchmark will be run and then you will have the overview.</Trans>
      </Typography>
    </Stack>
  ) : (
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
      <Box p={4}>
        <Divider />
      </Box>
      <Typography variant="h3" mb={2}>
        <Trans>Top fixes</Trans>
      </Typography>
      <TopFiveChecksCard data={data} />
    </>
  )
}
