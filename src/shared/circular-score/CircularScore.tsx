import {
  Box,
  BoxProps,
  CircularProgressProps,
  CircularProgress as MuiCircularProgress,
  Typography,
  TypographyProps,
  alpha,
  styled,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { colorFromRedToGreen } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

export interface CircularScoreProps extends CircularProgressProps {
  score: number
  syntaticScore?: number
  typographyProps?: TypographyProps
  containerProps?: BoxProps
}

const CirtularLabelContainer = styled(Box, { shouldForwardProp: shouldForwardPropWithBlackList(['scoreColor']) })<{
  scoreColor: string
}>(({ scoreColor, theme }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(scoreColor, 0.2),
  borderRadius: '50%',
  transition: theme.transitions.create('background-color'),
}))

const CircularProgress = styled(MuiCircularProgress)(({ theme }) => ({
  transition: theme.transitions.create('color'),
}))

export const CircularScore = ({ score, syntaticScore, typographyProps, containerProps, sx, ...props }: CircularScoreProps) => {
  const [scoreState, setScoreState] = useState(100)
  const timeout = useRef<number>()
  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
    }
    setScoreState(100)
    timeout.current = window.setTimeout(() => {
      setScoreState(score)
      timeout.current = undefined
    }, 10)
    return () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current)
      }
    }
  }, [score])
  const color = colorFromRedToGreen[scoreState]
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={syntaticScore ?? scoreState} sx={{ color, ...sx }} size={72} {...props} />
      <CirtularLabelContainer scoreColor={color} {...containerProps}>
        <Typography variant="h4" component="div" color={color} {...typographyProps}>
          {score}
        </Typography>
      </CirtularLabelContainer>
    </Box>
  )
}
