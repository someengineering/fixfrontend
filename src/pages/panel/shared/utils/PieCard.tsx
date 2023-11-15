import { Box, Divider, Grid, Paper, Stack, Typography, styled, useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { PieChart } from 'src/shared/charts'
import { CircularScore } from 'src/shared/circular-score'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { colorsBySeverity } from './colorsBySeverity'

const PieChartContainer = styled(Stack, { shouldForwardProp: shouldForwardPropWithBlackList(['opacity']) })<{ opacity: number }>(
  ({ theme, opacity }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    transition: theme.transitions.create('opacity'),
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    opacity,
  }),
)

const PieCardItemPaper = styled(Paper, { shouldForwardProp: shouldForwardPropWithBlackList(['score']) })(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  // background: alpha(colorFromRedToGreen[score], 0.1),
  padding: theme.spacing(2),
}))

const PieCardItem = ({
  data,
  score,
  title,
  cloud,
}: {
  data: { value: number; name: string }[]
  title: string
  score: number
  cloud: string
}) => {
  const theme = useTheme()
  const [showPieChart, setShowPieChart] = useState(false)
  const [hidingPieChart, setHidingPieChart] = useState(false)
  const showPieChartTimeoutRef = useRef<number>()
  const handleShowPieChart = () => {
    if (hidingPieChart) {
      setHidingPieChart(false)
    }
    if (showPieChartTimeoutRef.current) {
      window.clearTimeout(showPieChartTimeoutRef.current)
    }
    setShowPieChart(true)
  }
  const handleHidePieChart = () => {
    if (showPieChart && !hidingPieChart) {
      setHidingPieChart(true)
    }
    if (showPieChartTimeoutRef.current) {
      window.clearTimeout(showPieChartTimeoutRef.current)
    }
    if (showPieChart) {
      showPieChartTimeoutRef.current = window.setTimeout(() => {
        setHidingPieChart(false)
        setShowPieChart(false)
      }, theme.transitions.duration.standard)
    }
  }
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} onMouseEnter={handleShowPieChart} onMouseLeave={handleHidePieChart}>
      <PieCardItemPaper>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" width="100%">
          <Typography variant="body1" flex={1}>
            {title}
          </Typography>
          <CloudAvatar cloud={cloud} />
        </Stack>
        <Box py={1} width="100%">
          <Divider />
        </Box>
        <Stack width={170} alignSelf="center" justifyContent="end" overflow="visible" flex={1}>
          <Box position="relative" height={170}>
            <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
              <CircularScore
                score={score}
                syntaticScore={showPieChart ? 0 : score}
                size={150}
                typographyProps={{
                  variant: showPieChart ? 'h2' : 'h1',
                  sx: { transition: theme.transitions.create(['font-size']) },
                }}
              />
            </Stack>
            {showPieChart ? (
              <PieChartContainer opacity={hidingPieChart ? 0 : 1}>
                <PieChart
                  colors={colorsBySeverity}
                  data={data}
                  showLabel
                  pieProps={{
                    animationDuration: theme.transitions.duration.standard,
                    innerRadius: 40,
                    outerRadius: 80,
                  }}
                  width={200}
                  height={200}
                />
              </PieChartContainer>
            ) : null}
          </Box>
        </Stack>
      </PieCardItemPaper>
    </Grid>
  )
}

export const PieCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const pieData = useMemo(() => {
    return !data
      ? []
      : data.accounts.reduce(
          (prev, account) => [
            ...prev,
            ...data.benchmarks.reduce(
              (prev, benchmark) => {
                const account_summary = benchmark.account_summary[account.id]
                if (!account_summary) {
                  return prev
                }
                return [
                  ...prev,
                  {
                    data: [
                      {
                        value: account_summary.failed_checks?.critical || 0,
                        name: 'Critical',
                      },
                      {
                        value: account_summary.failed_checks?.high || 0,
                        name: 'High',
                      },
                      {
                        value: account_summary.failed_checks?.medium || 0,
                        name: 'Medium',
                      },
                      {
                        value: account_summary.failed_checks?.low || 0,
                        name: 'Low',
                      },
                    ],
                    title: account.name ? `${account.name} (${account.id})` : account.id,
                    cloud: account.cloud,
                    score: account.score ?? -1,
                  },
                ]
              },
              [] as { data: { value: number; name: string }[]; title: string; score: number; cloud: string }[],
            ),
          ],
          [] as { data: { value: number; name: string }[]; title: string; score: number; cloud: string }[],
        )
  }, [data])
  return pieData.length ? (
    <Grid container spacing={3} my={2}>
      {pieData.map((item, index) => (
        <PieCardItem key={index} {...item} />
      ))}
    </Grid>
  ) : null
}
