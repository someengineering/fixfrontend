import { t } from '@lingui/macro'
import { Stack, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { PieResourceCheckScore, createInventorySearchTo } from 'src/pages/panel/shared/utils'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FailedChecksType } from 'src/shared/types/server'
import { numberToShortHRT } from 'src/shared/utils/numberToShortHRT'
import { ToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface OverallScoreProps {
  score: number
  failedChecks: FailedChecksType
  failedResources: FailedChecksType
  availableResources: number
}

export const OverallScore = ({ score, failedChecks, failedResources, availableResources }: OverallScoreProps) => {
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
    <Stack mb={4} direction="row" justifyContent="center">
      <PieResourceCheckScore
        data={Object.entries(failedChecks).map(([name, value]) => ({
          name: ToUFStr(name),
          value: value,
          label: typeof failedResources[name] === 'number' ? numberToShortHRT(failedResources[name]) : numberToShortHRT(value),
          description: t`We've identified ${failedResources[
            name
          ]?.toLocaleString()} non-compliant resources out of ${availableResources.toLocaleString()} through ${value.toString()} ${name.toString()}-severity security checks.`,
          onClick: () => navigate(createInventorySearchTo(`/security.has_issues=true and /security.severity=${name}`)),
        }))}
        hidingPieChart={hidingPieChart}
        showPieChart={showPieChart}
        score={score}
        onMouseEnter={score < 100 ? handleShowPieChart : undefined}
        onMouseLeave={score < 100 ? handleHidePieChart : undefined}
        onScoreClick={() => navigate(createInventorySearchTo('/security.has_issues=true'))}
      />
    </Stack>
  )
}
