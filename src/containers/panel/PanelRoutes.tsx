import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from 'src/core/auth'

const HomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "home" */
      'src/pages/panel/panel-home/PanelHomePage'
    ),
)

const PanelSetupCloudPage = lazy(
  () =>
    import(
      /* webpackChunkName: "PanelSetupCloud" */
      'src/pages/panel/panel-setup-cloud/PanelSetupCloudPage'
    ),
)

export function PanelRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="setup-cloud" element={<PanelSetupCloudPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
