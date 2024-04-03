import { ButtonBase, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { useScaleSequentialMaterialRdYwGn } from 'src/shared/utils/useScaleSequentialMaterialRdYwGn'

const CELL_WIDTH = 50

interface HeatmapData {
  name: ReactNode
  value: number
  title: ReactNode
  tooltip: ReactNode
}

interface HeatmapProps {
  data: {
    title: ReactNode
    cells: HeatmapData[]
  }[]
}

const HeatmapCell = ({ title, value, tooltip }: HeatmapData) => {
  const getColors = useScaleSequentialMaterialRdYwGn(0, 100, 'main')
  const comp = (
    <Stack
      color="#fff"
      bgcolor={value >= 0 ? getColors(value) : undefined}
      width={CELL_WIDTH}
      height={CELL_WIDTH}
      alignItems="center"
      justifyContent="center"
      component={ButtonBase}
    >
      {value >= 0 ? title : '-'}
    </Stack>
  )
  return tooltip ? <Tooltip title={tooltip}>{comp}</Tooltip> : comp
}

export const Heatmap = ({ data }: HeatmapProps) => {
  const columns = useMemo(
    () =>
      data.reduce((prev, { cells }) => {
        cells.forEach((cell) => prev.add(cell.name))
        return prev
      }, new Set<ReactNode>()),
    [data],
  )
  return (
    <TableContainer>
      <Table size="small" padding="none" stickyHeader sx={{ maxWidth: '100%', width: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            {[...columns].map((column, i) => (
              <TableCell key={i} align="center" sx={{ verticalAlign: 'bottom', textAlign: '-webkit-center' }} width={CELL_WIDTH}>
                <Typography
                  whiteSpace="nowrap"
                  sx={{ writingMode: 'vertical-lr', textOrientation: 'sideways', transform: 'rotate(180deg)', mb: 1 }}
                >
                  {column}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(({ cells, title }, i) => (
            <TableRow key={i}>
              <TableCell sx={{ borderBottom: 'none' }}>
                <Typography pr={1} width={200}>
                  {title}
                </Typography>
              </TableCell>
              {cells.map((cell, j) => (
                <TableCell key={j} sx={{ borderBottom: 'none' }} width={CELL_WIDTH}>
                  <HeatmapCell {...cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
