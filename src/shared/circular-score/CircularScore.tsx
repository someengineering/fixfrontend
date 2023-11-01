import { Box, CircularProgress, CircularProgressProps, Typography, alpha, styled } from '@mui/material'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'
import { colorFromRedToGreen } from '../constants'

export interface CircularScoreProps extends CircularProgressProps {
  score: number
}

const CirtularLabelContainer = styled(Box, { shouldForwardProp: shouldForwardPropWithBlackList(['scoreColor']) })<{
  scoreColor: string
}>(({ scoreColor }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(scoreColor, 0.2),
  borderRadius: '50%',
}))

export const CircularScore = ({ score, ...props }: CircularScoreProps) => {
  const color = colorFromRedToGreen[score]
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={score} sx={{ color }} size={72} {...props} />
      <CirtularLabelContainer scoreColor={color}>
        <Typography variant="h4" component="div" color={color}>
          {score}
        </Typography>
      </CirtularLabelContainer>
    </Box>
  )
}
