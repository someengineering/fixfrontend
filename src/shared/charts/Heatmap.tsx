import { ButtonBase, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { useScaleSequentialRdYwGn } from 'src/shared/utils/useScaleSequentialRdYwGn'

const CELL_WIDTH = 50

interface HeatmapData {
  name: ReactNode
  value: number
  title: ReactNode
  tooltip: ReactNode
  href?: string
}

interface HeatmapProps {
  data: {
    title: ReactNode
    titleHref?: string
    cells: HeatmapData[]
  }[]
}

const NUMBER_OF_COLORS = 6

const HeatmapCell = ({ title, value, tooltip, href }: HeatmapData) => {
  const navigate = useAbsoluteNavigate()
  const getColors = useScaleSequentialRdYwGn([0, NUMBER_OF_COLORS])
  let comp = (
    <Stack
      color="#fff"
      bgcolor={value >= 0 ? getColors(Math.floor(value / (100 / NUMBER_OF_COLORS))) : undefined}
      width={CELL_WIDTH}
      height={CELL_WIDTH}
      alignItems="center"
      justifyContent="center"
      component={href ? ButtonBase : 'div'}
      sx={{ textDecoration: 'none' }}
    >
      {value >= 0 ? title : '-'}
    </Stack>
  )
  if (href) {
    comp = (
      <ButtonBase
        href={href}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate(href)
        }}
      >
        {comp}
      </ButtonBase>
    )
  }
  if (tooltip) {
    comp = (
      <Tooltip title={tooltip} arrow PopperProps={{ sx: { pointerEvents: 'none' } }}>
        {comp}
      </Tooltip>
    )
  }
  return comp
}

const HeatmapRow = ({ cells, title, titleHref }: HeatmapProps['data'][number]) => {
  const navigate = useAbsoluteNavigate()
  let compTitle = (
    <Typography pr={1} width={200}>
      {title}
    </Typography>
  )
  if (titleHref) {
    compTitle = (
      <ButtonBase
        href={titleHref}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate(titleHref)
        }}
        sx={{ textAlign: 'left', height: CELL_WIDTH }}
      >
        {compTitle}
      </ButtonBase>
    )
  }
  return (
    <TableRow>
      <TableCell sx={{ borderBottom: 'none' }}>{compTitle}</TableCell>
      {cells.map((cell, j) => (
        <TableCell key={j} sx={{ borderBottom: 'none' }} width={CELL_WIDTH}>
          <HeatmapCell {...cell} />
        </TableCell>
      ))}
    </TableRow>
  )
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
      <Table size="small" padding="none" stickyHeader sx={{ maxWidth: '100%', width: 'auto', pb: 2 }}>
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
          {data.map((data, i) => (
            <HeatmapRow key={i} {...data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
