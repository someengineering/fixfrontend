import { Box, CircularProgress, CircularProgressProps, Typography, alpha, styled } from '@mui/material'
import { scoreToStaticColor } from 'src/shared/utils/scoreToStaticColor'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

export interface CircularScoreProps extends CircularProgressProps {
  score: number
}

const CirtularLabelContainer = styled(Box, { shouldForwardProp: shouldForwardPropWithBlackList(['score']) })<{
  scoreColor: 'error' | 'warning' | 'info' | 'success'
}>(({ theme, scoreColor }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette[scoreColor].main, 0.2),
  borderRadius: '50%',
}))

export const CircularScore = ({ score, ...props }: CircularScoreProps) => {
  const color = scoreToStaticColor(score)
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" color={color} value={score} {...props} size={72} />
      <CirtularLabelContainer scoreColor={color}>
        <Typography variant="h4" component="div" color={`${color}.main`}>
          {Math.round(score)}
        </Typography>
      </CirtularLabelContainer>
    </Box>
  )
}
