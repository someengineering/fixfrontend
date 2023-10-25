import { colors as muicolors } from '@mui/material'
import { Cell, Pie, PieChart as RchPieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getMessage } from '../defined-messages'

interface PieChartProps {
  data: {
    value: number
    name: string
  }[]
  minData?: number
  maxData?: number
  minWidth?: number
  minHeight?: number
  colors?: { [key in string | number]: string } | string[]
  interpolate?: (t: number) => string
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  name: string
  value: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={13}>
      {getMessage(name)}: {value}
    </text>
  )
}

export function PieChart({ data, colors }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RchPieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={80}
          outerRadius={160}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="value"
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
