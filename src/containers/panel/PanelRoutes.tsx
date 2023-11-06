import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountCheckGuard } from 'src/shared/layouts/panel-layout'

const PanelHomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "panel-home" */
      'src/pages/panel/panel-home/PanelHomePage'
    ),
)

const PanelSetupCloudPage = lazy(
  () =>
    import(
      /* webpackChunkName: "panel-setup-cloud" */
      'src/pages/panel/panel-setup-cloud/PanelSetupCloudPage'
    ),
)

const PanelAccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "panel-accounts" */
      'src/pages/panel/panel-accounts/PanelAccountsPage'
    ),
)

export function PanelRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route element={<AccountCheckGuard />}>
          <Route index element={<PanelHomePage />} />
          <Route path="accounts" element={<PanelAccountsPage />} />
        </Route>
        <Route path="setup-cloud" element={<PanelSetupCloudPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
