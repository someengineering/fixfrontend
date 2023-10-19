import { Grid } from '@mui/material'
import { useMemo } from 'react'
import { Heatmap } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { interpolateRdYwGn } from 'src/shared/utils/interpolateRdYwGn'

export const HeatmapCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const heatmapData = useMemo(() => {
    return !data
      ? undefined
      : {
          data: data.benchmarks.reduce(
            (prev, item) => ({
              ...prev,
              [item.framework]: Object.keys(item.account_summary).reduce((prev, accountId) => {
                const account = data.accounts.find((account) => account.id === accountId)
                return {
                  ...prev,
                  [account?.name ?? accountId]: {
                    value: item.account_summary[accountId].score,
                    title: item.account_summary[accountId].score,
                  },
                }
              }, {}),
            }),
            {},
          ),
          numberOfSquares: data.benchmarks.map((i) => Object.keys(i.account_summary).length).reduce((prev, cur) => prev + cur, 0),
        }
  }, [data])
  return (
    heatmapData && (
      <Grid container spacing={2} my={2}>
        <Grid item width="100%">
          {data?.benchmarks && (
            <Heatmap data={heatmapData.data} maxData={100} minData={0} minHeight={20} minWidth={20} interpolate={interpolateRdYwGn} />
          )}
        </Grid>
      </Grid>
    )
  )
}
