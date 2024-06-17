import { useLingui } from '@lingui/react'
import { Box, useTheme } from '@mui/material'
import { LineChart, LineChartProps } from '@mui/x-charts'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { getColorBySeverity } from 'src/pages/panel/shared/utils'
import { sortedSeverities } from 'src/shared/constants'
import { VulnerableResources } from 'src/shared/types/server'
import { SeverityType } from 'src/shared/types/server-shared'
import { parseISO8601Duration } from 'src/shared/utils/parseDuration'
import { snakeCaseToUFStr } from 'src/shared/utils/snakeCaseToUFStr'

const getNumberFormatter = (locale: string) => (value: number | null) => (value ? Math.round(value).toLocaleString(locale) : '-')

export const VulnerableResourcesTimeline = ({ data }: { data: VulnerableResources }) => {
  const {
    i18n: { locale },
  } = useLingui()
  const {
    palette: {
      info: { main: infoColor },
    },
  } = useTheme()
  const { series, labels } = useMemo(() => {
    const numberFormatter = getNumberFormatter(locale)
    const { series, labels } = data.data.reduce(
      ({ labels, series }, cur) => {
        const curDate = new Date(cur.at)
        let currentDataIndex = labels.findIndex((i) => i.valueOf() === curDate.valueOf())
        const newLabels = [...labels]
        const newSeries = { ...series }
        if (currentDataIndex < 0) {
          newLabels.push(curDate)
          newLabels.sort((labelA, labelB) => new Date(labelA).valueOf() - new Date(labelB).valueOf())
          currentDataIndex = newLabels.findIndex((i) => i.valueOf() === curDate.valueOf())
        }
        const currentLabel = snakeCaseToUFStr(cur.group.severity)
        let currentColor = getColorBySeverity(cur.group.severity)
        if (currentColor === 'info.main') {
          currentColor = infoColor
        }
        if (!newSeries[cur.group.severity]) {
          const data = new Array(newLabels.length).fill(null)
          data[currentDataIndex] = cur.v
          newSeries[cur.group.severity] = {
            label: currentLabel,
            color: currentColor,
            valueFormatter: numberFormatter,
            data,
            area: true,
            stack: 'all',
            stackOffset: 'none',
            stackOrder: 'reverse',
            highlightScope: {
              highlighted: 'item',
              faded: 'global',
            },
          }
        } else {
          const data = [...(newSeries[cur.group.severity].data ?? [])]
          data[currentDataIndex] = cur.v
          newSeries[cur.group.severity] = {
            ...newSeries[cur.group.severity],
            data: data.map((i) => i ?? 0),
          }
        }
        return { series: newSeries, labels: newLabels }
      },
      {
        series: {} as Record<SeverityType, LineChartProps['series'][number]>,
        labels: [] as Date[],
      },
    )
    return {
      series: sortedSeverities
        .map((item) =>
          series[item]
            ? {
                ...series[item],
                data: Array.from({ length: labels.length }, (_, i) => series[item].data?.[i] ?? 0),
              }
            : undefined,
        )
        .filter((i) => i) as LineChartProps['series'],
      labels,
    }
  }, [data.data, infoColor, locale])
  return (
    <Box width="100%" overflow="auto">
      <Box minWidth={labels.length * 50} height={350}>
        <LineChart
          series={series}
          xAxis={[
            {
              scaleType: 'time',
              data: labels,
              tickNumber: labels.length,
              valueFormatter: (val: Date, ctx) =>
                ctx.location === 'tick'
                  ? dayjs(val).locale(locale).format('L')
                  : dayjs(val).format(parseISO8601Duration(data.granularity).duration >= 24 * 60 * 60 * 1000 ? 'dddd, LL' : 'llll'),
            },
          ]}
        />
      </Box>
    </Box>
  )
}
