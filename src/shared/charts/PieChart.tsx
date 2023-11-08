import { colors as muicolors } from '@mui/material'
import { Cell, Pie, PieProps, PieChart as RchPieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getMessage } from 'src/shared/defined-messages'

interface PieChartProps {
  data: {
    value: number
    name: string
  }[]
  showLabel?: boolean
  width?: number
  height?: number
  colors?: { [key in string | number]: string } | string[]
  pieProps?: Omit<PieProps, 'dataKey' | 'ref'>
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  endAngle,
  innerRadius,
  outerRadius,
  value,
}: {
  cx: number
  cy: number
  midAngle: number
  endAngle: number
  innerRadius: number
  outerRadius: number
  name: string
  value: number
}) => {
  if (midAngle - endAngle < (value > 9 ? (value > 99 ? 15 : 10) : 6) || !value) {
    return null
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={13}>
      {value}
    </text>
  )
}

export function PieChart({ data, showLabel, colors, pieProps = {}, width = 400, height = 400 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RchPieChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={80}
          outerRadius={160}
          label={showLabel ? renderCustomizedLabel : undefined}
          fill="#8884d8"
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          {...pieProps}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={Array.isArray(colors) ? colors[index] : colors?.[entry.name] ?? muicolors.lightBlue[600]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, getMessage(name as string)]} />
      </RchPieChart>
    </ResponsiveContainer>
  )
}
