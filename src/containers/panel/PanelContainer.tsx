import { useLingui } from '@lingui/react'
import { Suspense, useEffect } from 'react'
import { FixLogoNoBackground } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { WebSocketEvents } from 'src/core/events'
import { endPoints, env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { ContentRegion, LogoRegion, PanelLayout } from 'src/shared/layouts/panel-layout'
import { FullPageLoadingSuspenseFallback, LoadingSuspenseFallback } from 'src/shared/loading'
import { axiosWithAuth } from 'src/shared/utils/axios'
import { PanelInitialMessageHandler } from './PanelInitialMessageHandler'
import { PanelRoutes } from './PanelRoutes'

export default function PanelContainer() {
  const { selectedWorkspace, workspaces } = useUserProfile()
  useLingui()
  useEffect(() => {
    let abort: AbortController | undefined
    let timeout: number | undefined
    function doAbort() {
      if (abort && !abort?.signal.aborted) {
        abort.abort()
        abort = undefined
      }
    }
    function clickFunc() {
      doAbort()
      axiosWithAuth.post(endPoints.users.me.active).finally(() => {
        timeout = window.setTimeout(setListener, env.minActiveMinutes * 60 * 1000)
      })
    }
    function setListener() {
      timeout = undefined
      abort = new AbortController()
      window.addEventListener('mousedown', clickFunc, { once: true, signal: abort.signal, passive: true })
      window.addEventListener('keydown', clickFunc, { once: true, signal: abort.signal, passive: true })
    }
    timeout = window.setTimeout(setListener, env.minActiveMinutes * 60 * 1000)
    return () => {
      doAbort()
      if (timeout) {
        window.clearTimeout(timeout)
      }
    }
  }, [])
  return selectedWorkspace && workspaces?.length ? (
    <WebSocketEvents>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullPage />}>
          <PanelLayout>
            <LogoRegion>
              <FixLogoNoBackground color="primary.main" width={46} height={46} />
            </LogoRegion>
            <ContentRegion>
              <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                <Suspense fallback={<LoadingSuspenseFallback />}>
                  <PanelRoutes />
                </Suspense>
              </NetworkErrorBoundary>
            </ContentRegion>
            {/* <BottomRegion>
              <Typography variant="subtitle2">
                <Trans>© 2024 Some Engineering Inc. All rights reserved.</Trans>
              </Typography>
            </BottomRegion> */}
          </PanelLayout>
          <PanelInitialMessageHandler />
        </Suspense>
      </NetworkErrorBoundary>
    </WebSocketEvents>
  ) : (
    <FullPageLoadingSuspenseFallback forceFullPage />
  )
}
