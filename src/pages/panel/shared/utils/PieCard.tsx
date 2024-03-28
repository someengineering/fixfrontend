import { useLingui } from '@lingui/react'
import { Box, ButtonBase, Divider, Grid, Paper, Stack, Typography, styled, useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { PieResourceCheckScore } from './PieResourceCheckScore'
import { createInventorySearchTo } from './createInventorySearchTo'
import { createPieDataFromNonCompliance } from './createPieDataFromNonCompliance'

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

interface PieCardItemProps {
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
}

const PieCardItem = ({ id, data, score, title, cloud }: PieCardItemProps) => {
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

interface PieCardProps {
  data?: GetWorkspaceInventoryReportSummaryResponse
}

export const PieCard = ({ data }: PieCardProps) => {
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
            data: { value: number; name: string; label?: string; description?: string; onClick?: () => void }[]
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
