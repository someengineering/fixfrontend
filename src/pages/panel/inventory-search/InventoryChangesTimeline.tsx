import { useLingui } from '@lingui/react'
import { Box, colors, useMediaQuery } from '@mui/material'
import { BarChart, BarSeriesType } from '@mui/x-charts-pro'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useThemeMode } from 'src/core/theme'
import { postWorkspaceInventoryHistoryTimelineQuery } from 'src/pages/panel/shared/queries'
import { nodeChangeToString } from 'src/pages/panel/shared/utils'
import { useFixQueryParser } from 'src/shared/fix-query-parser'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceInventoryNodeHistoryChanges } from 'src/shared/types/server'
import { getNumberFormatter } from 'src/shared/utils/getNumberFormatter'
import { durationToCustomDurationString } from 'src/shared/utils/parseDuration'

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

const DEFAULT_LABELS_LENGTH = 26

export const InventoryChangesTimeline = ({ searchCrit }: InventoryChangesTimelineProps) => {
  const {
    history: { changes, after, before },
    onHistoryChange,
  } = useFixQueryParser()
  const beforeDate = useMemo(() => {
    const now = new Date()
    now.setMilliseconds(0)
    if (!before) {
      return now
    }
    const beforeDate = new Date(before)
    beforeDate.setMilliseconds(0)
    if (beforeDate.valueOf() > now.valueOf()) {
      return now
    }
    return beforeDate
  }, [before])
  const afterDate = useMemo(() => {
    if (!after) {
      const now = new Date()
      now.setMilliseconds(0)
      const aDayBefore = new Date(now.valueOf())
      aDayBefore.setMonth(now.getMonth() - 1)
      return aDayBefore
    } else {
      const afterDate = new Date(after)
      afterDate.setMilliseconds(0)
      return afterDate
    }
  }, [after])
  const { selectedWorkspace } = useUserProfile()
  const { mode } = useThemeMode()

  const { labelsDur, granularity } = useMemo(() => {
    const granularity =
      Math.max(Math.floor(Math.abs((beforeDate.valueOf() / 1000 - afterDate.valueOf() / 1000) / DEFAULT_LABELS_LENGTH)), 60 * 60) * 1000
    const labelsDur = []
    const end = beforeDate.valueOf()
    for (let current = afterDate.valueOf(); current < end; current += granularity) {
      labelsDur.push(current)
    }
    return { labelsDur, granularity }
  }, [afterDate, beforeDate])

  const isGranularityMoreThanADay = granularity >= 24 * 60 * 60 * 1000

  const {
    i18n: { locale },
  } = useLingui()
  const { data, isLoading } = useQuery({
    queryKey: [
      'workspace-inventory-history-timeline',
      selectedWorkspace?.id,
      searchCrit || 'all',
      changes.sort().join(','),
      afterDate.toISOString(),
      beforeDate.toISOString(),
      durationToCustomDurationString({ duration: granularity }),
    ],
    queryFn: postWorkspaceInventoryHistoryTimelineQuery,
  })

  const dummySeries = useMemo(() => {
    const numberFormatter = getNumberFormatter(locale)
    return changes.reduce(
      (prev, change) => ({
        ...prev,
        [change]: {
          type: 'bar',
          valueFormatter: numberFormatter,
          data: labelsDur.map(() => 0),
          label: nodeChangeToString(change),
          stack: 'total',
          color: getColorFromHistoryChange(change, mode === 'dark'),
          stackOffset: 'none',
        },
      }),
      {} as Record<WorkspaceInventoryNodeHistoryChanges, BarSeriesType>,
    )
  }, [changes, labelsDur, locale, mode])

  const [series, labels] = useMemo(() => {
    const labels = labelsDur.map((item) => new Date(item))
    if (data) {
      const [series, seriesChanges] = (Object.keys(dummySeries) as WorkspaceInventoryNodeHistoryChanges[]).reduce(
        (prev, change) => [
          [...prev[0], dummySeries[change]],
          [...prev[1], change],
        ],
        [[], []] as [BarSeriesType[], WorkspaceInventoryNodeHistoryChanges[]],
      )
      data.forEach(({ at, group: { change }, v }) => {
        const foundSeriesIndex = seriesChanges.indexOf(change)
        const foundDataIndex = labelsDur.indexOf(new Date(at).valueOf())
        if (foundDataIndex > -1 && foundSeriesIndex > -1 && series[foundSeriesIndex] && series[foundSeriesIndex].data) {
          series[foundSeriesIndex].data = [...series[foundSeriesIndex].data]
          series[foundSeriesIndex].data[foundDataIndex] = v
        }
      })
      return [series, labels]
    }
    return [[] as BarSeriesType[], labels]
  }, [data, dummySeries, labelsDur])

  const isLessThanMinWidth = useMediaQuery(({ breakpoints: { down } }) => down(labels.length * 20 + (labels.length < 6 ? 300 : 150)))
  const isMobile = useMediaQuery(({ breakpoints: { down } }) => down('md'))

  return !isLoading && !data ? null : (
    <Box width="100%" overflow="auto">
      <Box
        width="100%"
        maxWidth={!labels.length ? '100%' : labels.length * 62 + (labels.length < 6 ? 300 : 150)}
        minWidth={labels.length * 20 + (labels.length < 6 ? 300 : 150)}
        height={500}
        sx={isLessThanMinWidth || isMobile ? { pointerEvents: 'none' } : undefined}
      >
        {isLoading ? (
          <LoadingSuspenseFallback />
        ) : (
          <BarChart
            disableAxisListener
            // zoom={[
            //   {
            //     axisId: 'zoom-to-change-date',
            //     end: 100,
            //     start: 0,
            //   },
            // ]}
            margin={
              labels.length < 6
                ? {
                    right: 200,
                  }
                : undefined
            }
            height={500}
            series={series}
            yAxis={[{ scaleType: 'sqrt' }]}
            xAxis={[
              {
                scaleType: 'band',
                data: labels,
                valueFormatter: (val: Date, ctx) => {
                  if (ctx.location === 'tick') {
                    return dayjs(val)
                      .locale(locale)
                      .format(isGranularityMoreThanADay ? 'L' : 'l LT')
                  } else {
                    const after = dayjs(val.valueOf())
                    const before = dayjs(val.valueOf() + granularity)
                    return `${after.format(isGranularityMoreThanADay ? 'dddd, LL' : 'llll')} - ${before.format(isGranularityMoreThanADay ? 'dddd, LL' : 'llll')}`
                  }
                },
                // @ts-expect-error something
                categoryGapRatio: 0.5,
                zoom: {
                  panning: false,
                },
              },
            ]}
            onAxisClick={
              labels.length === 1
                ? undefined
                : (_, axisData) => {
                    if (axisData && axisData.axisValue && typeof axisData.axisValue === 'object') {
                      const afterValue = axisData.axisValue.valueOf()
                      const beforeValue = axisData.axisValue.valueOf() + granularity
                      const after = new Date(afterValue)
                      const before = new Date(beforeValue)
                      onHistoryChange({
                        changes,
                        after: after.toISOString(),
                        before: before.toISOString(),
                      })
                    }
                  }
            }
            slotProps={{
              legend: {
                direction: labels.length < 6 ? 'column' : 'row',
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
            borderRadius={4}
            onItemClick={labels.length === 1 ? undefined : () => {}}
          />
        )}
      </Box>
    </Box>
  )
}
