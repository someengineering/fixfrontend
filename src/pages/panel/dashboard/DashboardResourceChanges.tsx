import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { alpha, Box, MenuItem, Select, Stack, Tab, Tabs, Typography } from '@mui/material'
import { areaElementClasses, axisClasses, LineChartPro } from '@mui/x-charts-pro'
import { useSuspenseQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Suspense, useMemo, useState } from 'react'
import { HistoryIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { postWorkspaceInventoryHistoryTimelineQuery, postWorkspaceInventoryTimeseriesQuery } from 'src/pages/panel/shared/queries'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InternalLinkButton } from 'src/shared/link-button'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { PostWorkspaceInventoryHistoryTimelineResponse, PostWorkspaceInventoryTimeseriesResponse } from 'src/shared/types/server'

const daysDuration = [7, 30, 60, 90] as const
const getResourceTypes = (_: unknown) =>
  [
    { value: 'total', label: t`Total resources`, color: '#2C95F6' },
    { value: 'new', label: t`New resources`, color: '#F78400' },
    { value: 'updated', label: t`Updated resources`, color: '#0DAC4D' },
    { value: 'deleted', label: t`Deleted resources`, color: '#DB3939' },
  ] as const

const getMsFromDaysDurations = (day: number) => day * 24 * 60 * 60 * 1000

type ResourceTypeType = ReturnType<typeof getResourceTypes>[number]

interface ChartProps {
  afterDate: string
  beforeDate: string
  labels: number[]
  resourceType: ResourceTypeType
}
const Chart = ({ afterDate, beforeDate, labels, resourceType }: ChartProps) => {
  const { selectedWorkspace } = useUserProfile()
  const isTotal = resourceType.value === 'total'
  const [
    {
      data: { newResources, updatedResources, deletedResources },
    },
    { data: totalResources },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: [
          'workspace-inventory-history-timeline',
          isTotal ? undefined : selectedWorkspace?.id,
          'all',
          'node_created,node_updated,node_deleted',
          afterDate,
          beforeDate,
          '1d',
        ],
        queryFn: postWorkspaceInventoryHistoryTimelineQuery,
        select: (data: PostWorkspaceInventoryHistoryTimelineResponse) => {
          const newResources = labels.map(() => null as number | null)
          const updatedResources = labels.map(() => null as number | null)
          const deletedResources = labels.map(() => null as number | null)
          data.forEach(({ at, group: { change }, v }) => {
            const labelIndex = labels.indexOf(new Date(at).valueOf())
            if (labelIndex > -1) {
              switch (change) {
                case 'node_created':
                  newResources[labelIndex] = v
                  break
                case 'node_deleted':
                  deletedResources[labelIndex] = v
                  break
                case 'node_updated':
                  updatedResources[labelIndex] = v
                  break
              }
            }
          })
          return { newResources, updatedResources, deletedResources }
        },
      },
      {
        queryKey: [
          'workspace-inventory-timeseries',
          isTotal ? selectedWorkspace?.id : undefined,
          'resources',
          afterDate,
          beforeDate,
          '1d',
          '',
          undefined,
          'sum',
        ],
        queryFn: postWorkspaceInventoryTimeseriesQuery,
        select: ({ groups }: PostWorkspaceInventoryTimeseriesResponse) => {
          const totalResources = labels.map(() => null as number | null)
          groups.forEach(({ values }) => {
            Object.entries(values).forEach(([at, value]) => {
              const labelIndex = labels.indexOf(new Date(at).valueOf())
              totalResources[labelIndex] = (totalResources[labelIndex] ?? 0) + Math.round(value)
            })
          })
          return totalResources
        },
      },
    ],
  })
  let data: (number | null)[]
  switch (resourceType.value) {
    case 'total':
      data = totalResources
      break
    case 'new':
      data = newResources
      break
    case 'updated':
      data = updatedResources
      break
    case 'deleted':
      data = deletedResources
      break
  }

  return data.find((i) => i) ? (
    <LineChartPro
      yAxis={[{ scaleType: 'linear', disableLine: true, disableTicks: true }]}
      xAxis={[
        {
          scaleType: 'band',
          data: labels,
          valueFormatter: (val: number, ctx) => {
            if (ctx.location === 'tick') {
              return dayjs(val).format('MMM D')
            } else {
              const after = dayjs(val)
              return after.format('MMM D')
            }
          },
          disableLine: true,
        },
      ]}
      slotProps={{
        legend: { hidden: true },
      }}
      series={[{ data, area: true, color: resourceType.color, label: resourceType.label, connectNulls: true }]}
      height={400}
      sx={{
        [`& .${axisClasses.tick}`]: {
          stroke: 'transparent !important',
        },
        [`& .${areaElementClasses.root}`]: {
          fill: 'url(#resources-gradient-color)',
        },
      }}
    >
      <defs>
        <linearGradient id="resources-gradient-color" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={alpha(resourceType.color, 0.1)} />
          <stop offset="100%" stopColor={alpha(resourceType.color, 0)} />
        </linearGradient>
      </defs>
    </LineChartPro>
  ) : (
    <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
      <Typography variant="h4">No data to display</Typography>
    </Stack>
  )
}

export const DashboardResourceChanges = () => {
  const {
    i18n: { locale },
  } = useLingui()
  const resourceTypes = useMemo(() => getResourceTypes(locale), [locale])
  const [resourceType, setResourceType] = useState<ResourceTypeType>(resourceTypes[0])
  const [duration, setDuration] = useState<(typeof daysDuration)[number]>(daysDuration[0])
  const [afterDate, beforeDate, labels] = useMemo(() => {
    const beforeDate = new Date()
    beforeDate.setHours(0)
    beforeDate.setMinutes(0)
    beforeDate.setSeconds(0)
    beforeDate.setMilliseconds(0)
    beforeDate.setDate(beforeDate.getDate() + 1)
    const afterDate = new Date(beforeDate.valueOf() - getMsFromDaysDurations(duration))
    const end = beforeDate.valueOf()
    const labels = []
    const daysDuration = getMsFromDaysDurations(1)
    for (let current = afterDate.valueOf(); current < end; current += daysDuration) {
      labels.push(current)
    }
    return [afterDate.toISOString(), beforeDate.toISOString(), labels] as const
  }, [duration])
  return (
    <Stack spacing={5}>
      <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Tabs
          sx={{ flexGrow: 1 }}
          value={resourceType.value}
          onChange={(_, value) => {
            const newResourceType = resourceTypes.find((type) => type.value === value)
            if (newResourceType) {
              setResourceType(newResourceType)
            }
          }}
        >
          {resourceTypes.map((item) => (
            <Tab label={item.label} value={item.value} key={item.value} />
          ))}
        </Tabs>
        <Stack direction="row" spacing={1.5} alignItems="center" width={{ xs: '100%', lg: 'auto' }}>
          <Select
            value={duration}
            onChange={(e) => (typeof e.target.value === 'string' ? undefined : setDuration(e.target.value))}
            fullWidth
            sx={{ minWidth: 180 }}
          >
            {daysDuration.map((item) => (
              <MenuItem value={item} key={item}>
                <Trans>Last {item} days</Trans>
              </MenuItem>
            ))}
          </Select>
          <InternalLinkButton to="/inventory/history" fullWidth variant="outlined" startIcon={<HistoryIcon />}>
            History
          </InternalLinkButton>
        </Stack>
      </Stack>
      <Box width="100%" height={400}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <Chart afterDate={afterDate} beforeDate={beforeDate} labels={labels} resourceType={resourceType} />
          </Suspense>
        </NetworkErrorBoundary>
      </Box>
    </Stack>
  )
}
