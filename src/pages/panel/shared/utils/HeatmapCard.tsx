import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Divider, Grid, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { Heatmap } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { PieResourceCheckScore } from './PieResourceCheckScore'
import { createPieDataFromNonCompliance } from './createPieDataFromNonCompliance'

export const HeatmapCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const navigate = useAbsoluteNavigate()
  const {
    i18n: { locale },
  } = useLingui()
  const heatmapData = useMemo(() => {
    if (!data) {
      return {}
    }
    return !data
      ? {}
      : {
          data: data.benchmarks.map((benchmark) => ({
            title: benchmark.title,
            cells: data.accounts
              .filter((account) => (benchmark.account_summary[account.id]?.score ?? -1) >= 0)
              .map((account) => ({
                name: account.name ?? account.id,
                value: benchmark.account_summary[account.id]?.score ?? -1,
                title: benchmark.account_summary[account.id]?.score ?? -1,
                tooltip: (
                  <Stack spacing={1} p={1}>
                    <Typography>
                      <Trans>Account: {account.name ? `${account.name} (${account.id})` : account.id}</Trans>
                    </Typography>
                    <Typography>
                      <Trans>Benchmark: {benchmark.title}</Trans>
                    </Typography>
                    <Divider />
                    <PieResourceCheckScore
                      data={createPieDataFromNonCompliance(account, locale, navigate, true, true)}
                      score={benchmark.account_summary[account.id]?.score ?? -1}
                      showPieChart
                      noAnimation
                    />
                  </Stack>
                ),
              })),
          })),
        }
  }, [data, locale, navigate])

  return (
    heatmapData?.data && (
      <Grid container spacing={2} my={2}>
        <Grid item width="100%">
          {data?.benchmarks && <Heatmap data={heatmapData.data} />}
        </Grid>
      </Grid>
    )
  )
}
