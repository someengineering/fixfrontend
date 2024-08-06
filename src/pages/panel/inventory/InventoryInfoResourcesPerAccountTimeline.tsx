import { useLingui } from '@lingui/react'
import { Box, colors } from '@mui/material'
import { BarChart, BarChartProps } from '@mui/x-charts'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useThemeMode } from 'src/core/theme'
import { WorkspaceInfoResourcePerAccountTimeline } from 'src/shared/types/server'
import { getNumberFormatter } from 'src/shared/utils/getNumberFormatter'
import { parseISO8601Duration } from 'src/shared/utils/parseDuration'

const { common: _, ...realColors } = colors

const colorValues = Object.values(realColors)

const getColor = (previousJson: Record<string, string>, group: string, isDark: boolean) => {
  if (!previousJson[group]) {
    const colorIndex = Object.values(previousJson).length
    previousJson[group] = colorValues[colorIndex]?.[isDark ? '700' : '400']
  }
  return previousJson[group]
}

interface InventoryInfoResourcesPerAccountTimelineProps {
  data: WorkspaceInfoResourcePerAccountTimeline
}

export const InventoryInfoResourcesPerAccountTimeline = ({ data }: InventoryInfoResourcesPerAccountTimelineProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { mode } = useThemeMode()
  const { series, labels } = useMemo(() => {
    const colorMap = {} as Record<string, string>
    const numberFormatter = getNumberFormatter(locale)
    const labels = data.ats.map((i) => new Date(i))
    const series = data.groups.map(({ group_name, group, attributes, values }) => {
      const label = attributes?.name ?? group?.account_id ?? group_name.split('=')[1] ?? group_name
      return {
        valueFormatter: numberFormatter,
        data: data.ats.map((i) => values[i]),
        label,
        area: true,
        stack: 'total',
        color: getColor(colorMap, group_name, mode === 'dark'),
        stackOffset: 'none',
      } as BarChartProps['series'][number]
    })
    return {
      series,
      labels,
    }
  }, [data.ats, data.groups, locale, mode])
  return (
    <Box width="100%" overflow="auto">
      <Box width="100%" minWidth={labels.length * 50 + 150} height={500}>
        <BarChart
          slotProps={{
            legend: {
              direction: 'row',
              position: {
                vertical: 'top',
                horizontal: 'middle',
              },
              itemMarkWidth: 10,
              itemMarkHeight: 5,
              labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          }}
          borderRadius={4}
          series={series}
          xAxis={[
            {
              scaleType: 'band',
              data: labels,
              valueFormatter: (val: Date, ctx) =>
                ctx.location === 'tick'
                  ? dayjs(val).locale(locale).format('L')
                  : dayjs(val).format(parseISO8601Duration(data.granularity).duration >= 24 * 60 * 60 * 1000 ? 'dddd, LL' : 'llll'),
              // @ts-expect-error something
              categoryGapRatio: 0.9,
            },
          ]}
        />
      </Box>
    </Box>
  )
}
