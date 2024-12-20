import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Divider, Grid, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { Heatmap } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { PieResourceCheckScore } from './PieResourceCheckScore'
import { createPieDataFromNonCompliance } from './createPieDataFromNonCompliance'

interface HeatmapCardProps {
  data?: GetWorkspaceInventoryReportSummaryResponse
}

export const HeatmapCard = ({ data }: HeatmapCardProps) => {
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
            titleHref: `/compliance/${benchmark.id}`,
            cells: data.accounts.map((account) => ({
              name: account.name ?? account.id,
              value: benchmark.account_summary[account.id]?.score ?? -1,
              title: benchmark.account_summary[account.id]?.score ?? -1,
              tooltip:
                (benchmark.account_summary[account.id]?.score ?? -1) >= 0 ? (
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
                      score={benchmark.account_summary[account.id]?.score}
                      showPieChart
                      noAnimation
                    />
                  </Stack>
                ) : undefined,
              href: `/compliance/${benchmark.id}/${account.id}`,
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
