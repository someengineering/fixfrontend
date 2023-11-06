import { Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { PieChart } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { colorsBySeverity } from './colorsBySeverity'

export const PieCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const pieData = useMemo(() => {
    return !data
      ? []
      : data.benchmarks.reduce(
          (prev, benchmark) => [
            ...prev,
            ...Object.keys(benchmark.account_summary).reduce(
              (prev, accountId) => {
                const account = data.accounts.find((account) => account.id === accountId)
                return [
                  ...prev,
                  {
                    data: [
                      {
                        value: benchmark.account_summary[accountId].failed_checks?.critical || 0,
                        name: 'Critical',
                      },
                      {
                        value: benchmark.account_summary[accountId].failed_checks?.high || 0,
                        name: 'High',
                      },
                      {
                        value: benchmark.account_summary[accountId].failed_checks?.medium || 0,
                        name: 'Medium',
                      },
                      {
                        value: benchmark.account_summary[accountId].failed_checks?.low || 0,
                        name: 'Low',
                      },
                    ],
                    title: `${account?.name ?? accountId} - ${benchmark.title}`,
                  },
                ]
              },
              [] as { data: { value: number; name: string }[]; title: string }[],
            ),
          ],
          [] as { data: { value: number; name: string }[]; title: string }[],
        )
  }, [data])
  return pieData.length ? (
    <Grid container spacing={2} my={2}>
      {pieData.map((item, index) => (
        <Grid
          item
          xs={12}
          lg={6}
          xl={4}
          key={index}
          height={400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography variant="h6">{item.title}</Typography>
          <PieChart colors={colorsBySeverity} data={item.data} />
        </Grid>
      ))}
    </Grid>
  ) : null
}
