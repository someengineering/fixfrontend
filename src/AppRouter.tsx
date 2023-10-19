import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
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
  return (
    <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullpage />}>
      <Routes>
        <Route path="auth/*" element={<AuthContainer />} />
        <Route path="/*" element={<PanelContainer />} />
      </Routes>
    </Suspense>
  )
}
