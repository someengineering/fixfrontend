import { Paper, Stack, Typography, alpha, colors as muicolors, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNonce } from 'src/shared/providers'

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
  colors?: Record<string | number, string>
}

export function StackbarChart({ data, colors }: StackbarChartProps) {
  const theme = useTheme()
  const nonce = useNonce()
  const { rawData, barChartData, total } = useMemo(() => {
    const rawData = data.reduce(
      (prev1, cur1) => ({
        ...prev1,
        [cur1.title]: {
          ...prev1[cur1.title],
          ...cur1.data.reduce((prev2, cur2) => ({ ...prev2, [cur2.name]: cur2.value }), {} as Record<string, number>),
        },
      }),
      {} as Record<string, Record<string, number>>,
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
      [
        ...new Set(
          Object.keys(rawData)
            .map((name) =>
              Object.keys(rawData[name]).map((key) => {
                const splittedKey = key.split('-')
                const stackId = splittedKey[0].trim()
                const fill = colors?.[splittedKey[1].trim()] ?? muicolors.lightBlue[600]
                return JSON.stringify({ key, stackId, fill })
              }),
            )
            .flat(),
        ),
      ].map((item) => {
        const { key, stackId, fill } = JSON.parse(item) as { key: string; stackId: string; fill: string }
        return <Bar key={key} dataKey={key} stackId={stackId} fill={fill} />
      }),
    [colors, rawData],
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={1920}
        height={800}
        data={barChartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis angle={45} dataKey="name" textAnchor="start" height={150} fill={alpha(theme.palette.common.black, 0.8)} />
        <YAxis domain={[0, total]} type="number" allowDataOverflow={true} fill={alpha(theme.palette.common.black, 0.8)} />
        <Tooltip contentStyle={{ background: theme.palette.common.white }} />
        <Legend
          content={({ payload }) => (
            <Stack alignItems="center">
              <Paper component={Stack} direction="row" justifyContent="center" spacing={3} p={2} sx={{ flexWrap: 'wrap' }} width="auto">
                {payload?.map(({ value, color }, i) => (
                  <Stack direction="row" py={1} spacing={1} key={i}>
                    <div style={{ background: color, width: 16, height: 16 }} nonce={nonce} />
                    <Typography display="flex" key={i} color={color}>
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Paper>
            </Stack>
          )}
        />
        {bars}
      </BarChart>
    </ResponsiveContainer>
  )
}
