import { Grid, colors } from '@mui/material'
import { useMemo } from 'react'
import { StackbarChart } from 'src/shared/charts'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'

const COLORS = {
  Critical: colors.red[900],
  High: colors.deepOrange[700],
  Medium: colors.amber[600],
  Low: colors.lightGreen[500],
  Passed: colors.green[900],
}

// const calculatePassed = (failedChecks: Partial<FailedChecksType<number>>, total: number) =>
//   total - (failedChecks.critical || 0) - (failedChecks.high || 0) - (failedChecks.medium || 0) - (failedChecks.low || 0)

export const StackBarCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const stackBarData = useMemo(() => {
    return !data
      ? undefined
      : data.benchmarks
          .sort((a, b) => b.nr_of_checks - a.nr_of_checks)
          .reduce(
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
                          value: benchmark.account_summary[accountId].failed_checks.critical || 0,
                          name: `${benchmark.title} - Critical`,
                        },
                        {
                          value: benchmark.account_summary[accountId].failed_checks.high || 0,
                          name: `${benchmark.title} - High`,
                        },
                        {
                          value: benchmark.account_summary[accountId].failed_checks.medium || 0,
                          name: `${benchmark.title} - Medium`,
                        },
                        {
                          value: benchmark.account_summary[accountId].failed_checks.low || 0,
                          name: `${benchmark.title} - Low`,
                        },
                        // {
                        //   value: calculatePassed(benchmark.account_summary[accountId].failed_checks, benchmark.nr_of_checks),
                        //   name: `${benchmark.title} - Passed`,
                        // },
                      ],
                      title: `${account?.name ?? accountId}`,
                    },
                  ]
                },
                [] as { data: { value: number; name: string }[]; title: string }[],
              ),
            ],
            [] as { data: { value: number; name: string }[]; title: string }[],
          )
  }, [data])
  return stackBarData && stackBarData.length > 1 ? (
    <Grid container spacing={2} my={2}>
      <Grid item xs={12} height={700} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <StackbarChart colors={COLORS} data={stackBarData} />
      </Grid>
    </Grid>
  ) : null
}
