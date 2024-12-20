import { alpha, styled } from '@mui/material'
import { LogoWhiteNoBackground } from 'src/assets/icons'
import { panelUI } from 'src/shared/constants'
import { shouldForwardProp } from 'src/shared/utils/shouldForwardProp'

const Container = styled('div')({
  display: 'flex',
  position: 'relative',
})

const SpinnerCircle = styled('div', { shouldForwardProp })<{ width: number; isLoading?: boolean; withBackground?: boolean }>(
  ({ theme, width, isLoading, withBackground }) => ({
    position: 'absolute',
    backgroundColor: !withBackground && isLoading ? alpha(panelUI.uiThemePalette.text.darkGray, 0.2) : theme.palette.primary.dark,
    left: '50%',
    top: '50%',
    width: width,
    height: width,
    borderRadius: isLoading ? '50%' : '0',
    boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.1)',
    marginLeft: -(width / 2),
    marginTop: -(width / 2),
    transition: theme.transitions.create(['background-color', 'border-radius', 'box-shadow'], {
      duration: theme.transitions.duration.longer,
    }),
  }),
)

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
  animation: 'spinner-rotate-animation 1.2s infinite linear',

  '@keyframes spinner-rotate-animation': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}))

const SpinnerCircleMaskLine = styled('div', { shouldForwardProp })<{ width: number }>(({ width }) => ({
  width: width,
  height: width,
  borderRadius: '50%',
  boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.5)',
}))

const LogoWhiteNoBackgroundStyled = styled(LogoWhiteNoBackground)(({ theme }) => ({
  zIndex: 1,
  transition: theme.transitions.create(['width', 'height', 'box-shadow'], {
    duration: theme.transitions.duration.longer,
  }),
  fill: 'white',
}))

interface SpinnerProps {
  width?: number
  isLoading?: boolean
  withBackground?: boolean
}

const SpinnerContainer = styled(Container, { shouldForwardProp })<{ isLoading?: boolean }>(({ theme, isLoading }) => ({
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.longer,
  }),
  [theme.breakpoints.down('md')]: {
    opacity: isLoading ? 1 : 0,
  },
}))

export const Spinner = ({ width = 110, isLoading, withBackground }: SpinnerProps) => {
  return (
    <SpinnerContainer isLoading={isLoading}>
      <LogoWhiteNoBackgroundStyled width={isLoading ? width * 0.625 : width} height={isLoading ? width * 0.625 : width} />
      <SpinnerCircle width={width} isLoading={isLoading} withBackground={withBackground} />
      {isLoading ? (
        <SpinnerCircleMask width={width}>
          <SpinnerCircleMaskLine width={width} />
        </SpinnerCircleMask>
      ) : null}
    </SpinnerContainer>
  )
}
