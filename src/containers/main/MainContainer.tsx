import { Stack, styled } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { MainRoutes } from './MainRoutes'

const PanelWrapper = styled(Stack)(({ theme }) => ({
  background: theme.palette.common.white,
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export function MainContainer() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<FullPageLoadingSuspenseFallback />}>
        <PanelWrapper>
          <MainRoutes />
        </PanelWrapper>
      </Suspense>
    </ErrorBoundary>
  )
}
