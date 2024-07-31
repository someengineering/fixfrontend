import { useLingui } from '@lingui/react'
import { Box } from '@mui/material'
import { LineChart, LineChartProps } from '@mui/x-charts'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { WorkspaceInfoResourcePerAccountTimeline } from 'src/shared/types/server'
import { parseISO8601Duration } from 'src/shared/utils/parseDuration'

const getNumberFormatter = (locale: string) => (value: number | null) => (value ? Math.round(value).toLocaleString(locale) : '-')

interface InventoryInfoResourcesPerAccountTimelineProps {
  data: WorkspaceInfoResourcePerAccountTimeline
}

export const InventoryInfoResourcesPerAccountTimeline = ({ data }: InventoryInfoResourcesPerAccountTimelineProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { series, labels } = useMemo(() => {
    const numberFormatter = getNumberFormatter(locale)
    const labels = data.ats.map((i) => new Date(i))
    const series = data.groups.map(
      ({ group_name: label, values }) =>
        ({
          valueFormatter: numberFormatter,
          data: data.ats.map((i) => values[i]),
          label,
          area: true,
          stack: 'total',
          stackOffset: 'none',
          highlightScope: {
            highlighted: 'item',
            faded: 'global',
          },
        }) as LineChartProps['series'][number],
    )
    return {
      series,
      labels,
    }
  }, [data, locale])
  return (
    <Box width="100%" overflow="auto">
      <Box width="100%" minWidth={labels.length * 50 + 150} height={350}>
        <LineChart
          slotProps={{
            legend: {
              direction: 'row',
              position: {
                vertical: 'top',
                horizontal: 'right',
              },
              itemMarkWidth: 10,
              itemMarkHeight: 5,
              labelStyle: {
                fontSize: 10,
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            },
          }}
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
