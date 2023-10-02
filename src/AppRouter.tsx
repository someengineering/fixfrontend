import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FullPageLoadingSuspenseFallback } from './shared/loading'

const AuthContainer = lazy(
  () =>
    import(
      /* webpackChunkName: "auth" */
      'src/containers/auth/AuthContainer'
    ),
)

const PanelContainer = lazy(
  () =>
    import(
      /* webpackChunkName: "panel" */
      'src/containers/panel/PanelContainer'
    ),
)

export function AppRouter() {
  const { pathname } = useLocation()
  return (
    <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullpage withLoading={pathname.startsWith('/auth')} />}>
      <Routes>
        <Route path="auth/*" element={<AuthContainer />} />
        <Route path="/*" element={<PanelContainer />} />
      </Routes>
    </Suspense>
  )
}
