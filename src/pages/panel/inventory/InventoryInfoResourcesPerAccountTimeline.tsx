import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Box, colors } from '@mui/material'
import { BarChart, BarChartProps } from '@mui/x-charts'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useThemeMode } from 'src/core/theme'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'
import { WorkspaceInfoResourcePerAccountTimeline } from 'src/shared/types/server'
import { AccountCloud } from 'src/shared/types/server-shared'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { getNumberFormatter } from 'src/shared/utils/getNumberFormatter'
import { parseISO8601Duration } from 'src/shared/utils/parseDuration'

const colorValues = Object.values([
  colors.red,
  colors.green,
  colors.lime,
  colors.purple,
  colors.pink,
  colors.teal,
  colors.indigo,
  colors.amber,
  colors.brown,
  colors.green,
  colors.blueGrey,
])

const createCloudAccountData = (name: AccountCloud, numberFormatter: (value: number | null) => string, isDark: boolean) =>
  ({
    valueFormatter: numberFormatter,
    data: [],
    label: name === 'aws' || name === 'azure' || name === 'gcp' ? t`Other ${getAccountCloudName(name)} accounts` : name,
    area: true,
    stack: 'total',
    color: (name === 'aws' ? colors.orange : name === 'azure' ? colors.blue : name === 'gcp' ? colors.yellow : colors.grey)[
      isDark ? 700 : 400
    ],
    stackOffset: 'none',
  }) as BarChartProps['series'][number]

const addData = (baseData: BarChartProps['series'][number], dataToAdd: BarChartProps['series'][number]['data']) => {
  if (baseData?.data?.length) {
    baseData.data = baseData.data.map((value, index) => (value ?? 0) + (dataToAdd?.[index] ?? 0))
  } else {
    baseData.data = dataToAdd ?? []
  }
  return baseData
}

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
  const { selectedWorkspace } = useUserProfile()
  const {
    i18n: { locale },
  } = useLingui()
  const { mode } = useThemeMode()
  const { data: cloudAccounts } = useQuery({
    queryFn: getWorkspaceCloudAccountsQuery,
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
    select: (clouds) => (!clouds || typeof clouds === 'string' ? undefined : [...clouds.added, ...clouds.discovered, ...clouds.recent]),
  })
  const { series: preProcessedSeries, labels } = useMemo(() => {
    const colorMap = {} as Record<string, string>
    const numberFormatter = getNumberFormatter(locale)
    const filteredGroups = cloudAccounts?.length
      ? data.groups.filter(({ group }) => cloudAccounts.find((account) => account.account_id === group?.account_id))
      : data.groups
    const labels = data.ats.map((i) => new Date(i))
    const series = filteredGroups.map(({ group_name, group, attributes, values }) => {
      const foundCloudAccount = cloudAccounts?.find((account) => account.account_id === group?.account_id)

      const label =
        foundCloudAccount?.user_account_name ||
        foundCloudAccount?.api_account_name ||
        foundCloudAccount?.api_account_alias ||
        attributes?.name ||
        group?.account_id ||
        group_name.split('=')[1]
      return {
        valueFormatter: numberFormatter,
        data: data.ats.map((i) => values[i]),
        label,
        accountId: group?.account_id,
        area: true,
        stack: 'total',
        color: getColor(colorMap, group_name, mode === 'dark'),
        stackOffset: 'none',
      } as BarChartProps['series'][number] & { accountId?: string }
    })
    return {
      series,
      labels,
    }
  }, [cloudAccounts, data.ats, data.groups, locale, mode])
  const series = useMemo(() => {
    if (preProcessedSeries.length > 12) {
      const numberFormatter = getNumberFormatter(locale)
      const series = [...preProcessedSeries]
      if (cloudAccounts?.length) {
        const { gcp, aws, azure, rest } = series.splice(7).reduce(
          ({ gcp, aws, azure, rest }, { data, accountId }) => {
            const cloudName = cloudAccounts.find((cloud) => cloud.account_id === accountId)?.cloud
            switch (cloudName) {
              case 'aws':
                aws = addData(aws, data)
                break
              case 'azure':
                azure = addData(azure, data)
                break
              case 'gcp':
                gcp = addData(gcp, data)
                break
              default:
                rest = addData(rest, data)
                break
            }
            return { gcp, aws, azure, rest }
          },
          {
            gcp: createCloudAccountData('gcp', numberFormatter, mode === 'dark'),
            aws: createCloudAccountData('aws', numberFormatter, mode === 'dark'),
            azure: createCloudAccountData('azure', numberFormatter, mode === 'dark'),
            rest: createCloudAccountData(t`Others`, numberFormatter, mode === 'dark'),
          },
        )
        let i = 8
        if (aws.data?.length) {
          series[i] = aws
          i++
        }
        if (gcp.data?.length) {
          series[i] = gcp
          i++
        }
        if (azure.data?.length) {
          series[i] = azure
          i++
        }
        if (rest.data?.length) {
          series[i] = rest
          i++
        }
      } else {
        const rest = series
          .splice(10)
          .reduce((rest, { data }) => addData(rest, data), createCloudAccountData(t`Others`, numberFormatter, mode === 'dark'))
        series[11] = rest
      }
      return series
    }
    return preProcessedSeries
  }, [cloudAccounts, locale, mode, preProcessedSeries])
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
              itemGap: 5,
              markGap: 5,
              padding: 5,
            },
          }}
          margin={{ top: 50 }}
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
