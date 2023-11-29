import { t } from '@lingui/macro'
import { Box, ButtonBase, Divider, Grid, Paper, Stack, Typography, styled, useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { numberToShortHRT } from 'src/shared/utils/numberToShortHRT'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { PieResourceCheckScore } from './PieResourceCheckScore'
import { createInventorySearchTo } from './createInventorySearchTo'

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
  id,
  data,
  score,
  title,
  cloud,
}: {
  data: {
    value: number
    name: string
    description?: string
    label?: string
  }[]
  id: string
  title: string
  score: number
  cloud: string
}) => {
  const theme = useTheme()
  const navigate = useAbsoluteNavigate()
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
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={2}
      onMouseEnter={score < 100 ? handleShowPieChart : undefined}
      onMouseLeave={score < 100 ? handleHidePieChart : undefined}
    >
      <PieCardItemPaper>
        <ButtonBase
          onClick={() => navigate(createInventorySearchTo(`/security.has_issues=true and /ancestors.account.reported.id="${id}"`))}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" width="100%">
            <Typography variant="body1" flex={1} align="left">
              {title}
            </Typography>
            <CloudAvatar cloud={cloud} />
          </Stack>
        </ButtonBase>
        <Box py={1} width="100%">
          <Divider />
        </Box>
        <PieResourceCheckScore
          data={data}
          hidingPieChart={hidingPieChart}
          showPieChart={showPieChart}
          score={score}
          onScoreClick={() => navigate(createInventorySearchTo(`/security.has_issues=true and /ancestors.account.reported.id="${id}"`))}
        />
      </PieCardItemPaper>
    </Grid>
  )
}

export const PieCard = ({ data }: { data?: GetWorkspaceInventoryReportSummaryResponse }) => {
  const navigate = useAbsoluteNavigate()
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
                        label: account_summary.failed_checks?.critical
                          ? typeof account_summary.failed_resources?.critical === 'number'
                            ? numberToShortHRT(account_summary.failed_resources.critical)
                            : numberToShortHRT(account_summary.failed_checks.critical)
                          : undefined,
                        description: account_summary.failed_checks?.critical
                          ? t`We've identified ${
                              account_summary.failed_resources?.critical?.toLocaleString() ?? ''
                            } non-compliant resources out of ${account.resource_count.toLocaleString()} through ${
                              account_summary.failed_checks?.critical.toLocaleString() ?? '0'
                            } ${'Critical'.toString()}-severity security checks.`
                          : undefined,
                        onClick: () => {
                          navigate(
                            createInventorySearchTo(
                              `/security.has_issues=true and /ancestors.account.reported.id="${account.id}" and /security.severity=critical`,
                            ),
                          )
                        },
                      },
                      {
                        value: account_summary.failed_checks?.high || 0,
                        name: 'High',
                        label: account_summary.failed_checks?.high
                          ? typeof account_summary.failed_resources?.high === 'number'
                            ? numberToShortHRT(account_summary.failed_resources.high)
                            : numberToShortHRT(account_summary.failed_checks.high)
                          : undefined,
                        description: account_summary.failed_checks?.high
                          ? t`We've identified ${
                              account_summary.failed_resources?.high?.toLocaleString() ?? ''
                            } non-compliant resources out of ${account.resource_count.toLocaleString()} through ${
                              account_summary.failed_checks?.high.toLocaleString() ?? '0'
                            } ${'High'.toString()}-severity security checks.`
                          : undefined,
                        onClick: () => {
                          navigate(
                            createInventorySearchTo(
                              `/security.has_issues=true and /ancestors.account.reported.id="${account.id}" and /security.severity=high`,
                            ),
                          )
                        },
                      },
                      {
                        value: account_summary.failed_checks?.medium || 0,
                        name: 'Medium',
                        label: account_summary.failed_checks?.medium
                          ? typeof account_summary.failed_resources?.medium === 'number'
                            ? numberToShortHRT(account_summary.failed_resources.medium)
                            : numberToShortHRT(account_summary.failed_checks.medium)
                          : undefined,
                        description: account_summary.failed_checks?.medium
                          ? t`We've identified ${
                              account_summary.failed_resources?.medium?.toLocaleString() ?? ''
                            } non-compliant resources out of ${account.resource_count.toLocaleString()} through ${
                              account_summary.failed_checks?.medium.toLocaleString() ?? '0'
                            } ${'Medium'.toString()}-severity security checks.`
                          : undefined,
                        onClick: () => {
                          navigate(
                            createInventorySearchTo(
                              `/security.has_issues=true and /ancestors.account.reported.id="${account.id}" and /security.severity=medium`,
                            ),
                          )
                        },
                      },
                      {
                        value: account_summary.failed_checks?.low || 0,
                        name: 'Low',
                        label: account_summary.failed_checks?.low
                          ? typeof account_summary.failed_resources?.low === 'number'
                            ? numberToShortHRT(account_summary.failed_resources.low)
                            : numberToShortHRT(account_summary.failed_checks.low)
                          : undefined,
                        description: account_summary.failed_checks?.low
                          ? t`We've identified ${
                              account_summary.failed_resources?.low?.toLocaleString() ?? ''
                            } non-compliant resources out of ${account.resource_count.toLocaleString()} through ${
                              account_summary.failed_checks?.low.toLocaleString() ?? '0'
                            } ${'Low'.toString()}-severity security checks.`
                          : undefined,
                        onClick: () => {
                          navigate(
                            createInventorySearchTo(
                              `/security.has_issues=true and /ancestors.account.reported.id="${account.id}" and /security.severity=low`,
                            ),
                          )
                        },
                      },
                    ],
                    id: account.id,
                    title: account.name ? `${account.name} (${account.id})` : account.id,
                    cloud: account.cloud,
                    score: account.score ?? -1,
                  },
                ]
              },
              [] as {
                id: string
                data: { value: number; name: string; label?: string; description?: string; onClick: () => void }[]
                title: string
                score: number
                cloud: string
              }[],
            ),
          ],
          [] as {
            id: string
            data: { value: number; name: string; label?: string; description?: string; onClick: () => void }[]
            title: string
            score: number
            cloud: string
          }[],
        )
  }, [data, navigate])
  return pieData.length ? (
    <Grid container spacing={3} my={2}>
      {pieData.map((item, index) => (
        <PieCardItem key={index} {...item} />
      ))}
    </Grid>
  ) : null
}
