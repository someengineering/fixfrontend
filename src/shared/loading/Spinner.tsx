import { alpha, keyframes, styled } from '@mui/material'
import { LogoWhiteNoBackground } from 'src/assets/icons'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Container = styled('div')({
  display: 'flex',
  position: 'absolute',
})

const SpinnerCircle = styled('div', { shouldForwardProp })<{ width: number; isLoading?: boolean }>(({ theme, width, isLoading }) => ({
  position: 'absolute',
  backgroundColor: isLoading ? 'rgba(0, 0, 0, 0.2)' : alpha(theme.palette.primary.main, 0.8),
  left: '50%',
  top: '50%',
  width: width,
  height: width,
  borderRadius: isLoading ? '50%' : '0',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  marginLeft: -(width / 2),
  marginTop: -(width / 2),
  transition: theme.transitions.create(['background-color', 'border-radius', 'box-shadow'], {
    duration: theme.transitions.duration.longer,
  }),
}))

const SpinnerCircleMask = styled('div', { shouldForwardProp })<{ width: number }>(({ width }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: width / 2,
  height: width,
  marginLeft: -(width / 2),
  marginTop: -(width / 2),
  overflow: 'hidden',
  transformOrigin: `${width / 2}px ${width / 2}px`,
  maskImage: 'linear-gradient(top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
  WebkitMaskImage: '-webkit-linear-gradient(top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
  animation: `${rotateAnimation} 1.2s infinite linear`,
}))

const SpinnerCircleMaskLine = styled('div', { shouldForwardProp })<{ width: number }>(({ width }) => ({
  width: width,
  height: width,
  borderRadius: '50%',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
}))

const LogoWhiteNoBackgroundStyled = styled(LogoWhiteNoBackground)(({ theme }) => ({
  zIndex: 1,
  transition: theme.transitions.create(['width', 'height', 'box-shadow'], {
    duration: theme.transitions.duration.longer,
  }),
}))

interface SpinnerProps {
  width?: number
  isLoading?: boolean
}

const SpinnerContainer = styled(Container, { shouldForwardProp })<{ isLoading?: boolean }>(({ theme, isLoading }) => ({
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.longer,
  }),
  [theme.breakpoints.down('md')]: {
    opacity: isLoading ? 1 : 0,
  },
}))

export const Spinner = ({ width = 110, isLoading }: SpinnerProps) => {
  return (
    <SpinnerContainer isLoading={isLoading}>
      <LogoWhiteNoBackgroundStyled width={isLoading ? width * 0.625 : width} height={isLoading ? width * 0.625 : width} fill="white" />
      <SpinnerCircle width={width} isLoading={isLoading} />
      {isLoading ? (
        <SpinnerCircleMask width={width}>
          <SpinnerCircleMaskLine width={width} />
        </SpinnerCircleMask>
      ) : null}
    </SpinnerContainer>
  )
}
