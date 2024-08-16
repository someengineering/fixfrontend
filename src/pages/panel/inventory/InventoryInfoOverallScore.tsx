import { Stack } from '@mui/material'
import { Gauge, gaugeClasses } from '@mui/x-charts-pro'
import { colorFromRedToGreen } from 'src/shared/constants'

interface InventoryInfoOverallScoreProps {
  score: number
  title: string
}

export const InventoryInfoOverallScore = ({ score, title }: InventoryInfoOverallScoreProps) => (
  <Stack>
    <Gauge
      width={300}
      height={150}
      value={score}
      startAngle={-90}
      endAngle={90}
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 40,
          transform: 'translate(0px, -25px)',
          text: {
            fill: colorFromRedToGreen[score] ?? (({ palette }) => palette.info.main),
          },
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: colorFromRedToGreen[score] ?? (({ palette }) => palette.info.main),
        },
      }}
      title={title}
    />
  </Stack>
)
