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
import { ElementType, useEffect, useRef, useState } from 'react'
import { colorFromRedToGreen } from 'src/shared/constants'
import { shouldForwardPropWithBlackList } from 'src/shared/utils/shouldForwardProp'

export interface CircularScoreProps<RootComponent extends ElementType = 'div', AdditionalProps = object> extends CircularProgressProps {
  score: number
  syntheticScore?: number
  typographyProps?: TypographyProps
  containerProps?: BoxProps<RootComponent, AdditionalProps>
}

const CircularLabelContainer = styled(Box, { shouldForwardProp: shouldForwardPropWithBlackList(['scoreColor']) })<{
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

export function CircularScore<RootComponent extends ElementType = 'div', AdditionalProps = object>({
  score,
  syntheticScore,
  typographyProps,
  containerProps,
  sx,
  ...props
}: CircularScoreProps<RootComponent, AdditionalProps>) {
  const [scoreState, setScoreState] = useState(100)
  const timeoutRef = useRef<number>()
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setScoreState(100)
    timeoutRef.current = window.setTimeout(() => {
      setScoreState(score)
      timeoutRef.current = undefined
    }, 10)
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [score])
  const color = colorFromRedToGreen[scoreState]
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={syntheticScore ?? scoreState} sx={{ color, ...sx }} size={72} {...props} />
      <CircularLabelContainer scoreColor={color} {...containerProps}>
        <Typography variant="h4" component="div" color={color} {...typographyProps}>
          {score}
        </Typography>
      </CircularLabelContainer>
    </Box>
  )
}
