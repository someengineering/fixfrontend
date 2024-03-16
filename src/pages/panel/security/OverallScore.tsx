import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Stack, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { PieResourceCheckScore, createInventorySearchTo } from 'src/pages/panel/shared/utils'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FailedChecksType } from 'src/shared/types/server'
import { numberToShortHRT } from 'src/shared/utils/numberToShortHRT'
import { wordToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

interface OverallScoreProps {
  score: number
  failedChecks: Partial<FailedChecksType>
  failedResources: Partial<FailedChecksType>
  availableResources: number
}

export const OverallScore = ({ score, failedChecks, failedResources, availableResources }: OverallScoreProps) => {
  const theme = useTheme()
  const navigate = useAbsoluteNavigate()
  const [showPieChart, setShowPieChart] = useState(false)
  const [hidingPieChart, setHidingPieChart] = useState(false)
  const showPieChartTimeoutRef = useRef<number>()
  const {
    i18n: { locale },
  } = useLingui()
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
          name: wordToUFStr(name),
          value: failedResources[name] ?? 0,
          label: typeof failedResources[name] === 'number' ? numberToShortHRT(failedResources[name] ?? 0, locale) : undefined,
          description:
            typeof failedResources[name] === 'number' && typeof value === 'number'
              ? t`We've identified ${(failedResources[name] as number).toLocaleString(
                  locale,
                )} non-compliant resources out of ${availableResources.toLocaleString(locale)} ${wordToUFStr(name).toString()}-severity security checks.`
              : undefined,
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
