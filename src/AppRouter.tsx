import { lazy, memo, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './core/auth'
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

export const AppRouter = memo(
  () => (
    <Suspense fallback={<FullPageLoadingSuspenseFallback forceFullpage />}>
      <Routes>
        <Route path="auth/*" element={<AuthContainer />} />
        <Route element={<RequireAuth />}>
          <Route path="/*" element={<PanelContainer />} />
        </Route>
      </Routes>
    </Suspense>
  ),
  () => true,
)
