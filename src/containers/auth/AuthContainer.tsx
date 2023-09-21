import { alpha, CardContent, CardHeader, Container, Stack, styled } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FixLogo } from 'src/assets/icons'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { AuthRoutes } from './AuthRoutes'

const AuthCardStyle = styled(Stack)({
  flex: '1 0 auto',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
})

const AuthWrapper = styled(Container)(({ theme }) => ({
  position: 'fixed',
  overflow: 'auto',
  right: 0,
  top: 0,
  background: theme.palette.common.white,
  height: '100vh',
  width: '50%',
  opacity: 0,
  animationDelay: '1s',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationName: 'fadeIn',
  animationTimingFunction: 'ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      right: '-50%',
    },
    '100%': {
      opacity: 1,
      ritgh: '0',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    background: alpha(theme.palette.common.white, 0.8),
  },
}))

export function AuthContainer() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback withLoading />}>
        <AuthWrapper>
          <AuthCardStyle>
            <CardHeader title={<FixLogo width={128} height={128} />} />
            <CardContent>
              <AuthRoutes />
            </CardContent>
          </AuthCardStyle>
        </AuthWrapper>
      </Suspense>
    </ErrorBoundary>
  )
}
