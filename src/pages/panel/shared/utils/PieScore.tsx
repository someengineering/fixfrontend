import { Box, Stack, StackProps, styled, useTheme } from '@mui/material'
import { PieChart } from 'src/shared/charts'
import { CircularScore } from 'src/shared/circular-score'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { colorsBySeverity } from './colorsBySeverity'

const PieChartContainer = styled(Stack, { shouldForwardProp: shouldForwardPropWithBlackList(['opacity']) })<{ opacity: number }>(
  ({ theme, opacity }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    transition: theme.transitions.create('opacity'),
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    opacity,
  }),
)

interface PieScoreProps extends StackProps {
  data: { value: number; name: string }[]
  score: number
  showPieChart: boolean
  hidingPieChart: boolean
}

export const PieScore = ({ data, score, showPieChart, hidingPieChart, ...props }: PieScoreProps) => {
  const theme = useTheme()
  return (
    <Stack width={170} alignSelf="center" justifyContent="end" overflow="visible" flex={1} {...props}>
      <Box position="relative" height={170}>
        <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
          <CircularScore
            score={score}
            syntaticScore={showPieChart ? 0 : score}
            size={150}
            typographyProps={{
              variant: showPieChart ? 'h2' : 'h1',
              sx: { transition: theme.transitions.create(['font-size']) },
            }}
          />
        </Stack>
        {showPieChart ? (
          <PieChartContainer opacity={hidingPieChart ? 0 : 1}>
            <PieChart
              colors={colorsBySeverity}
              data={data}
              showLabel
              pieProps={{
                animationDuration: theme.transitions.duration.standard,
                innerRadius: 40,
                outerRadius: 80,
              }}
              width={200}
              height={200}
            />
          </PieChartContainer>
        ) : null}
      </Box>
    </Stack>
  )
}
