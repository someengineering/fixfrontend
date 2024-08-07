import { useLingui } from '@lingui/react'
import { Box, colors } from '@mui/material'
import { BarChart, BarChartProps } from '@mui/x-charts'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useThemeMode } from 'src/core/theme'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { PostWorkspaceInventoryHistoryTimelineResponse, WorkspaceInventoryNodeHistoryChanges } from 'src/shared/types/server'
import { getNumberFormatter } from 'src/shared/utils/getNumberFormatter'
import { postWorkspaceInventoryHistoryTimelineQuery } from './postWorkspaceInventoryHistoryTimeline.query'
import { inventoryRenderNodeChangeCellToString } from './utils/inventoryRenderNodeChangeCell'

interface InventoryChangesTimelineProps {
  searchCrit: string
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

const fakeData = [
  {
    at: '2024-05-22T18:14:24.000Z',
    group: {
      change: 'node_updated',
    },
    v: 1,
  },
  {
    at: '2024-05-23T17:16:48.000Z',
    group: {
      change: 'node_created',
    },
    v: 6,
  },
  {
    at: '2024-05-23T17:16:48.000Z',
    group: {
      change: 'node_deleted',
    },
    v: 6,
  },
  {
    at: '2024-05-23T17:16:48.000Z',
    group: {
      change: 'node_vulnerable',
    },
    v: 2,
  },
  {
    at: '2024-05-23T17:16:48.000Z',
    group: {
      change: 'node_compliant',
    },
    v: 2,
  },
  {
    at: '2024-05-23T17:16:48.000Z',
    group: {
      change: 'node_updated',
    },
    v: 6,
  },
  {
    at: '2024-05-24T04:48:00.000Z',
    group: {
      change: 'node_created',
    },
    v: 24,
  },
  {
    at: '2024-05-24T04:48:00.000Z',
    group: {
      change: 'node_deleted',
    },
    v: 18,
  },
  {
    at: '2024-05-24T16:19:12.000Z',
    group: {
      change: 'node_updated',
    },
    v: 1,
  },
  {
    at: '2024-05-28T00:57:36.000Z',
    group: {
      change: 'node_created',
    },
    v: 2,
  },
  {
    at: '2024-05-28T00:57:36.000Z',
    group: {
      change: 'node_updated',
    },
    v: 5,
  },
  {
    at: '2024-05-29T11:31:12.000Z',
    group: {
      change: 'node_updated',
    },
    v: 4524,
  },
  {
    at: '2024-05-29T11:31:12.000Z',
    group: {
      change: 'node_created',
    },
    v: 4859,
  },
  {
    at: '2024-05-30T10:33:36.000Z',
    group: {
      change: 'node_updated',
    },
    v: 230,
  },
  {
    at: '2024-05-31T09:36:00.000Z',
    group: {
      change: 'node_updated',
    },
    v: 11,
  },
  {
    at: '2024-05-31T21:07:12.000Z',
    group: {
      change: 'node_updated',
    },
    v: 1,
  },
  {
    at: '2024-06-01T20:09:36.000Z',
    group: {
      change: 'node_updated',
    },
    v: 73,
  },
  {
    at: '2024-06-02T07:40:48.000Z',
    group: {
      change: 'node_updated',
    },
    v: 150,
  },
  {
    at: '2024-06-02T19:12:00.000Z',
    group: {
      change: 'node_updated',
    },
    v: 21,
  },
] as PostWorkspaceInventoryHistoryTimelineResponse

export const InventoryChangesTimeline = ({ searchCrit }: InventoryChangesTimelineProps) => {
  const {
    history: { changes, after, before },
    onHistoryChange,
  } = useFixQueryParser()
  const beforeDate = useMemo(() => (before ? new Date(before) : new Date()), [before])
  const afterDate = useMemo(() => (after ? new Date(after) : new Date(new Date().setMonth(new Date().getMonth() - 1))), [after])
  const { selectedWorkspace } = useUserProfile()
  const { mode } = useThemeMode()
  const {
    i18n: { locale },
  } = useLingui()
  const { isLoading } = useQuery({
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
  const data = fakeData
  const { series, labels } = useMemo(() => {
    if (data) {
      const numberFormatter = getNumberFormatter(locale)
      const processedLabels = {} as Record<string, Date>
      let index = -1
      const series = {} as Record<WorkspaceInventoryNodeHistoryChanges, BarChartProps['series'][number]>
      data.forEach(({ at, group: { change }, v }) => {
        if (!processedLabels[at]) {
          processedLabels[at] = new Date(at)
          index++
        }
        if (!series[change] || !series[change].data) {
          const seriesData = [] as number[]
          seriesData[index] = v
          series[change] = {
            valueFormatter: numberFormatter,
            data: [...seriesData],
            label: inventoryRenderNodeChangeCellToString(change),
            stack: 'total',
            color: getColorFromHistoryChange(change, mode === 'dark'),
            stackOffset: 'none',
          }
        } else {
          series[change].data[index] = v
          series[change].data = [...series[change].data]
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
  return !isLoading && !data ? null : (
    <Box width="100%" overflow="auto">
      <Box width="100%" maxWidth={!labels.length ? '100%' : labels.length * 62 + 150} minWidth={labels.length * 20 + 150} height={500}>
        {isLoading ? (
          <LoadingSuspenseFallback />
        ) : (
          <BarChart
            slotProps={{
              legend: {
                direction: 'row',
                position: {
                  vertical: 'top',
                  horizontal: labels.length < 6 ? 'right' : 'middle',
                },
                itemMarkWidth: 10,
                itemMarkHeight: 5,
                labelStyle: {
                  fontSize: 12,
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                itemGap: 5,
                markGap: 5,
                padding: 5,
              },
            }}
            margin={{ top: 50 }}
            borderRadius={4}
            series={series}
            yAxis={[{ scaleType: 'sqrt' }]}
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
            onAxisClick={(_, axisData) => {
              if (axisData && axisData.axisValue && typeof axisData.axisValue === 'object') {
                const after = new Date(axisData.axisValue.valueOf())
                after.setHours(0)
                after.setMinutes(0)
                after.setSeconds(0)
                after.setMilliseconds(0)
                const before = new Date(after.valueOf())
                before.setDate(before.getDate() + 1)
                onHistoryChange({
                  changes,
                  after: after.toISOString(),
                  before: before.toISOString(),
                })
              }
            }}
            onItemClick={() => {}}
          />
        )}
      </Box>
    </Box>
  )
}
