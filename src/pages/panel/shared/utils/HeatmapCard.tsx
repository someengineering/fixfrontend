import { Grid } from '@mui/material'
import { useMemo } from 'react'
import { Heatmap } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'

export const HeatmapCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const heatmapData = useMemo(() => {
    return !data
      ? {}
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
        }
  }, [data])
  return (
    heatmapData?.data && (
      <Grid container spacing={2} my={2}>
        <Grid item width="100%">
          {data?.benchmarks && <Heatmap data={heatmapData.data} minHeight={20} minWidth={20} />}
        </Grid>
      </Grid>
    )
  )
}
