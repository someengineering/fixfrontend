import { Stack, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { PieScore } from 'src/pages/panel/shared/utils'
import { FailedChecksType } from 'src/shared/types/server'
import { ToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface OverallScoreProps {
  score: number
  failedChecks: Partial<FailedChecksType>
}

export const OverallScore = ({ score, failedChecks }: OverallScoreProps) => {
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
    <Stack mb={4} direction="row" justifyContent="center">
      <PieScore
        data={Object.entries(failedChecks).map(([name, value]) => ({ name: ToUFStr(name), value }))}
        hidingPieChart={hidingPieChart}
        showPieChart={showPieChart}
        score={score}
        onMouseEnter={score < 100 ? handleShowPieChart : undefined}
        onMouseLeave={score < 100 ? handleHidePieChart : undefined}
      />
    </Stack>
  )
}
