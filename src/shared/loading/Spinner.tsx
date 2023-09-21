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

const SpinnerCircle = styled('div', { shouldForwardProp })<{ width: number; isDark?: boolean; isLoading?: boolean }>(
  ({ theme, width, isDark, isLoading }) => ({
    position: 'absolute',
    backgroundColor:
      isDark ?? theme.palette.mode === 'dark'
        ? isLoading
          ? alpha(theme.palette.common.black, 0.2)
          : alpha(theme.palette.primary.main, 0.8)
        : alpha(theme.palette.common.white, 0.2),
    left: '50%',
    top: '50%',
    width: width,
    height: width,
    borderRadius: isLoading ? '50%' : '0',
    boxShadow: `inset 0 0 0 1px ${
      isDark ?? theme.palette.mode === 'dark'
        ? isLoading
          ? alpha(theme.palette.common.white, 0.1)
          : theme.palette.common.white
        : isLoading
        ? alpha(theme.palette.common.black, 0.1)
        : theme.palette.common.black
    }`,
    marginLeft: -(width / 2),
    marginTop: -(width / 2),
    transition: theme.transitions.create(['background-color', 'border-radius', 'box-shadow'], {
      duration: 1000,
      easing: theme.transitions.easing.easeInOut,
    }),
  }),
)

const SpinnerCircleMask = styled('div', { shouldForwardProp })<{ width: number; isDark?: boolean }>(({ theme, width, isDark }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: width / 2,
  height: width,
  marginLeft: -(width / 2),
  marginTop: -(width / 2),
  overflow: 'hidden',
  transformOrigin: `${width / 2}px ${width / 2}px`,
  WebkitMaskImage: `-webkit-linear-gradient(top, ${
    isDark ?? theme.palette.mode === 'dark'
      ? `${alpha(theme.palette.common.black, 1)}, ${alpha(theme.palette.common.black, 0)}`
      : `${alpha(theme.palette.common.white, 1)}, ${alpha(theme.palette.common.white, 0)}`
  })`,
  animation: `${rotateAnimation} 1.2s infinite linear`,
}))

const SpinnerCircleMaskLine = styled('div', { shouldForwardProp })<{ width: number; isDark?: boolean }>(({ theme, width, isDark }) => ({
  width: width,
  height: width,
  borderRadius: '50%',
  boxShadow: `inset 0 0 0 1px ${
    isDark ?? theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.5) : alpha(theme.palette.common.black, 0.5)
  }`,
}))

const LogoWhiteNoBackgroundStyled = styled(LogoWhiteNoBackground)(({ theme }) => ({
  zIndex: 1,
  transition: theme.transitions.create(['width', 'height', 'box-shadow'], {
    duration: 1000,
    easing: theme.transitions.easing.easeInOut,
  }),
}))

interface SpinnerProps {
  width?: number
  isDark?: boolean
  isLoading?: boolean
}

const SpinnerContainer = styled(Container, { shouldForwardProp })<{ isLoading?: boolean }>(({ theme, isLoading }) =>
  isLoading
    ? {}
    : {
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
)

export const Spinner = ({ width = 110, isDark, isLoading }: SpinnerProps) => {
  return (
    <SpinnerContainer isLoading={isLoading}>
      <LogoWhiteNoBackgroundStyled
        width={isLoading ? width * 0.625 : width}
        height={isLoading ? width * 0.625 : width}
        fill={isLoading ? undefined : 'white'}
      />
      <SpinnerCircle width={width} isDark={isDark} isLoading={isLoading} />
      {isLoading ? (
        <SpinnerCircleMask width={width} isDark={isDark}>
          <SpinnerCircleMaskLine width={width} isDark={isDark} />
        </SpinnerCircleMask>
      ) : null}
    </SpinnerContainer>
  )
}

// TODO: this is default spinner maybe later we should change it

// export const Spinner = styled('div', { shouldForwardProp })<{ width?: number }>(({ theme, width = 80 }) => ({
//   display: 'inline-block',
//   width: width,
//   height: width,

//   '&:after': {
//     content: '" "',
//     display: 'block',
//     width: width * 0.8,
//     height: width * 0.8,
//     margin: theme.spacing(1),
//     borderRadius: '50%',
//     border: `${theme.spacing(0.75)} solid ${theme.palette.primary.main}`,
//     borderColor: `${theme.palette.primary.main} transparent ${theme.palette.primary.main} transparent`,
//     animation: 'lds-dual-ring 1.2s linear infinite',
//   },

//   '@keyframes lds-dual-ring': {
//     '0%': {
//       transform: 'rotate(0deg)',
//     },
//     '100%': {
//       transform: 'rotate(360deg)',
//     },
//   },
// }))
