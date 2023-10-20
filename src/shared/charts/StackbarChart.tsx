import { colors as muicolors } from '@mui/material'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getMessage } from '../defined-messages'

interface StackbarChartProps {
  data: {
    data: {
      value: number
      name: string
    }[]
    title: string
  }[]
  minData?: number
  maxData?: number
  minWidth?: number
  minHeight?: number
  colors?: { [key in string | number]: string }
  interpolate?: (t: number) => string
}

export function StackbarChart({ data, colors }: StackbarChartProps) {
  const { rawData, barChartData, total } = useMemo(() => {
    const rawData = data.reduce(
      (prev1, cur1) => ({
        ...prev1,
        [cur1.title]: {
          ...prev1[cur1.title],
          ...cur1.data.reduce(
            (prev2, cur2) => ({ ...prev2, [cur2.name]: cur2.value }),
            {} as {
              [key in string]: number
            },
          ),
        },
      }),
      {} as { [key in string]: { [key in string]: number } },
    )
    return {
      rawData,
      total: Math.max(...data.map((key) => key.data.reduce((prev, situation) => prev + situation.value, 0))),
      barChartData: Object.keys(rawData).map((key) => ({
        name: key,
        ...rawData[key],
      })),
    }
  }, [data])

  const bars = useMemo(
    () =>
      Object.keys(rawData)
        .map((name) =>
          Object.keys(rawData[name]).map((key) => {
            const splittedKey = key.split('-')
            const stackId = splittedKey[0].trim()
            const fill = colors?.[splittedKey[1].trim()] ?? muicolors.lightBlue[600]
            return <Bar key={key} dataKey={key} stackId={stackId} fill={fill} />
          }),
        )
        .flat(),
    [colors, rawData],
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={1920}
        height={700}
        data={barChartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis angle={45} dataKey="name" />
        <YAxis domain={[0, total]} type="number" allowDataOverflow={true} />
        <Tooltip
          formatter={(value, name) => [value, getMessage((name as string).split(' - ').map(getMessage).join(' - '))]}
          payloadUniqBy={({ name, value }) => name?.toString() ?? '' + value?.toString() ?? ''}
        />
        <Legend formatter={(value) => value.split(' - ').map(getMessage).join(' - ')} payloadUniqBy={({ value }) => value} />
        {bars}
      </BarChart>
    </ResponsiveContainer>
  )
}
