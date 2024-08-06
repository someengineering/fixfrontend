import { useLingui } from '@lingui/react'
import { Box, colors } from '@mui/material'
import { BarChart, BarChartProps } from '@mui/x-charts'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useThemeMode } from 'src/core/theme'
import { WorkspaceInventoryNodeHistoryChanges, WorkspaceInventorySearchTableHistory } from 'src/shared/types/server'
import { getNumberFormatter } from 'src/shared/utils/getNumberFormatter'
import { postWorkspaceInventoryHistoryTimelineQuery } from './postWorkspaceInventoryHistoryTimeline.query'
import { inventoryRenderNodeChangeCellToString } from './utils/inventoryRenderNodeChangeCell'

interface InventoryChangesTimelineProps {
  searchCrit: string
  history: WorkspaceInventorySearchTableHistory
}

const getColorFromHistoryChange = (change: WorkspaceInventoryNodeHistoryChanges, isDark?: boolean) => {
  switch (change) {
    case 'node_created':
      return colors.blue[isDark ? '700' : '400']
    case 'node_updated':
      return colors.blueGrey[isDark ? '700' : '400']
    case 'node_deleted':
      return colors.deepOrange[isDark ? '700' : '400']
    case 'node_vulnerable':
      return colors.red[isDark ? '700' : '400']
    case 'node_compliant':
      return colors.green[isDark ? '700' : '400']
  }
}

export const InventoryChangesTimeline = ({ searchCrit, history: { changes, after, before } }: InventoryChangesTimelineProps) => {
  const beforeDate = useMemo(() => (before ? new Date(before) : new Date()), [before])
  const afterDate = useMemo(() => (after ? new Date(after) : new Date(new Date().setMonth(new Date().getMonth() - 1))), [after])
  const { selectedWorkspace } = useUserProfile()
  const { mode } = useThemeMode()
  const {
    i18n: { locale },
  } = useLingui()
  const { data } = useQuery({
    queryKey: [
      'workspace-inventory-history-timeline',
      selectedWorkspace?.id,
      searchCrit || 'all',
      changes.sort().join(','),
      afterDate.toISOString(),
      beforeDate.toISOString(),
      '',
    ],
    queryFn: postWorkspaceInventoryHistoryTimelineQuery,
  })
  const { series, labels } = useMemo(() => {
    if (data) {
      const numberFormatter = getNumberFormatter(locale)
      const processedLabels = {} as Record<string, Date>
      const series = {} as Record<WorkspaceInventoryNodeHistoryChanges, BarChartProps['series'][number]>
      data.forEach(({ at, group: { change }, v }) => {
        if (!processedLabels[at]) {
          processedLabels[at] = new Date(at)
        }
        if (!series[change]) {
          series[change] = {
            valueFormatter: numberFormatter,
            data: [v],
            label: inventoryRenderNodeChangeCellToString(change),
            stack: 'total',
            color: getColorFromHistoryChange(change, mode === 'dark'),
            stackOffset: 'none',
          }
        } else {
          series[change].data?.push(v)
        }
      })
      const labels = Object.entries(processedLabels).sort(([, a], [, b]) => a.valueOf() - b.valueOf())
      return {
        series: Object.values(series),
        labels: labels.map(([_, date]) => date),
      }
    }
    return {
      series: [],
      labels: [],
    }
  }, [data, locale, mode])

  const granularity = labels.length
    ? Math.max(Math.abs((beforeDate.valueOf() - afterDate.valueOf()) / labels.length), 60 * 60 * 1000)
    : 24 * 60 * 60 * 1000
  return (
    <Box width="100%" overflow="auto">
      <Box width="100%" minWidth={labels.length * 20 + 150} height={500}>
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
                  : dayjs(val).format(granularity >= 24 * 60 * 60 * 1000 ? 'dddd, LL' : 'llll'),
              // @ts-expect-error something
              categoryGapRatio: 0.5,
            },
          ]}
        />
      </Box>
    </Box>
  )
}
