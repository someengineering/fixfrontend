import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
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
  const {
    i18n: { locale },
  } = useLingui()
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
                        value: account.failed_resources_by_severity?.critical ?? 0,
                        name: 'Critical',
                        label:
                          typeof account.failed_resources_by_severity?.critical === 'number'
                            ? numberToShortHRT(account.failed_resources_by_severity.critical, locale)
                            : undefined,
                        description:
                          typeof account.failed_resources_by_severity?.critical === 'number' &&
                          typeof account_summary.failed_checks?.critical === 'number'
                            ? t`We've identified ${
                                account.failed_resources_by_severity.critical.toLocaleString(locale) ?? '0'
                              } non-compliant resources out of ${account.resource_count.toLocaleString(locale)} through ${
                                account_summary.failed_checks.critical.toLocaleString(locale) ?? '0'
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
                        value: account.failed_resources_by_severity?.high ?? 0,
                        name: 'High',
                        label:
                          typeof account.failed_resources_by_severity?.high === 'number'
                            ? numberToShortHRT(account.failed_resources_by_severity.high, locale)
                            : undefined,
                        description:
                          typeof account.failed_resources_by_severity?.high === 'number' &&
                          typeof account_summary.failed_checks?.high === 'number'
                            ? t`We've identified ${
                                account.failed_resources_by_severity.high.toLocaleString(locale) ?? '0'
                              } non-compliant resources out of ${account.resource_count.toLocaleString(locale)} through ${
                                account_summary.failed_checks.high.toLocaleString(locale) ?? '0'
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
                        value: account.failed_resources_by_severity?.medium ?? 0,
                        name: 'Medium',
                        label:
                          typeof account.failed_resources_by_severity?.medium === 'number'
                            ? numberToShortHRT(account.failed_resources_by_severity.medium, locale)
                            : undefined,
                        description:
                          typeof account.failed_resources_by_severity?.medium === 'number' &&
                          typeof account_summary.failed_checks?.medium === 'number'
                            ? t`We've identified ${
                                account.failed_resources_by_severity.medium.toLocaleString(locale) ?? '0'
                              } non-compliant resources out of ${account.resource_count.toLocaleString(locale)} through ${
                                account_summary.failed_checks.medium.toLocaleString(locale) ?? '0'
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
                        value: account.failed_resources_by_severity?.low ?? 0,
                        name: 'Low',
                        label:
                          typeof account.failed_resources_by_severity?.low === 'number'
                            ? numberToShortHRT(account.failed_resources_by_severity.low, locale)
                            : undefined,
                        description:
                          typeof account.failed_resources_by_severity?.low === 'number' &&
                          typeof account_summary.failed_checks?.low === 'number'
                            ? t`We've identified ${
                                account.failed_resources_by_severity.low.toLocaleString(locale) ?? '0'
                              } non-compliant resources out of ${account.resource_count.toLocaleString(locale)} through ${
                                account_summary.failed_checks.low.toLocaleString(locale) ?? '0'
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
  }, [data, navigate, locale])
  return pieData.length ? (
    <Grid container spacing={3} my={2}>
      {pieData.map((item, index) => (
        <PieCardItem key={index} {...item} />
      ))}
    </Grid>
  ) : null
}
