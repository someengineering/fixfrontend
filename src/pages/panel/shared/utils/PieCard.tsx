import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Box, ButtonBase, Divider, Grid, Paper, Stack, Typography, styled, useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { FailedChecksType, GetWorkspaceInventoryReportSummaryResponse, WorkspaceAccountReportSummary } from 'src/shared/types/server'
import { numberToShortHRT } from 'src/shared/utils/numberToShortHRT'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { wordToUFStr } from 'src/shared/utils/snakeCaseToUFStr'
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

const createPieDataFromName = (
  name: 'critical' | 'high' | 'medium' | 'low',
  accountFailedResources: Partial<FailedChecksType<number>> | null,
  resourceCount: number,
  locale: string,
  navigate: NavigateFunction,
  accountId: string,
) => {
  const accountFailedResource = accountFailedResources?.[name]
  const label = wordToUFStr(name)
  return {
    value: accountFailedResource ?? 0,
    name: label,
    label: typeof accountFailedResource === 'number' ? numberToShortHRT(accountFailedResource, locale) : undefined,
    description: t`We've identified ${
      accountFailedResource?.toLocaleString(locale) ?? '0'
    } non-compliant resources out of ${resourceCount?.toLocaleString(locale)} ${label.toString()}-severity security checks.`,
    onClick: () => {
      navigate(
        createInventorySearchTo(
          `/security.has_issues=true and /ancestors.account.reported.id="${accountId}" and /security.severity=${name}`,
        ),
      )
    },
  }
}

const createPieDataFromNonCompliance = (account: WorkspaceAccountReportSummary, locale: string, navigate: NavigateFunction) => {
  return (['critical', 'high', 'medium', 'low'] as const).map((name) =>
    createPieDataFromName(name, account.failed_resources_by_severity, account.resource_count, locale, navigate, account.id),
  )
}

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
            {
              data: createPieDataFromNonCompliance(account, locale, navigate),
              id: account.id,
              title: account.name ? `${account.name} (${account.id})` : account.id,
              cloud: account.cloud,
              score: account.score ?? -1,
            },
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
