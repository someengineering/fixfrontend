import { Stack } from '@mui/material'
import { Gauge, gaugeClasses } from '@mui/x-charts'

interface InventoryInfoOverallScoreProps {
  score: number
  title: string
}

export const InventoryInfoOverallScore = ({ score, title }: InventoryInfoOverallScoreProps) => (
  <Stack alignItems="center">
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
            fill: ({ palette }) => palette.primary.main,
          },
        },
      }}
      title={title}
    />
  </Stack>
)
