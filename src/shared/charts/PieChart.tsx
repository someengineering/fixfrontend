import { useLingui } from '@lingui/react'
import { Popover as MuiPopover, Paper, PopoverOrigin, Typography, colors as muicolors, popoverClasses, styled } from '@mui/material'
import { useRef, useState } from 'react'
import { Cell, Pie, PieProps, PieChart as RchPieChart } from 'recharts'

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',
  [`.${popoverClasses.paper}`]: {
    transition: theme.transitions.create(['left', 'top', 'transform-origin', 'transform', 'opacity', 'box-shadow']) + '!important',
  },
}))

interface PieChartProps {
  data: {
    value: number
    name: string
    description?: string
    label?: string
    onClick?: () => void
  }[]
  showLabel?: boolean
  width?: number
  height?: number
  colors?: Record<string | number, string> | string[]
  pieProps?: Omit<PieProps, 'dataKey' | 'ref'>
}

const RADIAN = Math.PI / 180

export function PieChart({ data, showLabel, colors, pieProps = {}, width = 400, height = 400 }: PieChartProps) {
  const containerRef = useRef<HTMLElement | undefined>()
  const {
    i18n: { locale },
  } = useLingui()
  const [popoverData, setPopoverData] = useState<{ origin: PopoverOrigin; content: string; anchor?: HTMLElement }>({
    content: '',
    origin: { horizontal: 'center', vertical: 'top' },
  })
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    endAngle,
    innerRadius,
    outerRadius,
    value,
    description,
    label,
    onClick,
  }: {
    cx: number
    cy: number
    midAngle: number
    endAngle: number
    innerRadius: number
    outerRadius: number
    name: string
    value: number
    description?: string
    label?: string
    onClick?: () => void
  }) => {
    const textToShow = label ?? value.toLocaleString(locale)
    const textLength = textToShow.length
    if (midAngle - endAngle < (textLength > 1 ? textLength * 5 : 6) || !textLength) {
      return null
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        onMouseEnter={
          description
            ? () =>
                setPopoverData((prev) => ({
                  content: description,
                  origin: prev.origin,
                  anchor: containerRef.current,
                }))
            : undefined
        }
        onMouseUp={onClick}
      >
        {textToShow}
      </text>
    )
  }
  return (
    <>
      <RchPieChart
        width={width}
        height={height}
        // @ts-expect-error // TODO: this comment should be removed after update to recharts > 2.13
        ref={(e) => (containerRef.current = e?.container)}
      >
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
          minAngle={25}
          {...pieProps}
          onMouseEnter={({
            description,
            tooltipPosition,
          }: PieChartProps['data'][number] & { tooltipPosition: { x: number; y: number } }) =>
            description
              ? setPopoverData({
                  content: description,
                  origin: { horizontal: tooltipPosition.x, vertical: tooltipPosition.y },
                  anchor: containerRef.current,
                })
              : undefined
          }
          onMouseLeave={({ description }: PieChartProps['data'][number]) =>
            description ? setPopoverData((prev) => ({ ...prev, anchor: undefined })) : undefined
          }
        >
          {data.map((entry, index) => (
            <Cell
              color={Array.isArray(colors) ? colors[index] : (colors?.[entry.name] ?? muicolors.lightBlue[600])}
              key={`cell-${index}`}
              onMouseUp={entry.onClick}
              cursor={entry.onClick ? 'pointer' : undefined}
              pointerEvents={entry.onClick ? 'all' : undefined}
            />
          ))}
        </Pie>
      </RchPieChart>
      {
        <Popover
          open={!!popoverData?.anchor}
          anchorOrigin={popoverData?.origin}
          anchorEl={popoverData?.anchor}
          disablePortal
          disableScrollLock
          disableRestoreFocus
          disableEnforceFocus
          disableAutoFocus
          hideBackdrop
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">{popoverData?.content}</Typography>
          </Paper>
        </Popover>
      }
    </>
  )
}
