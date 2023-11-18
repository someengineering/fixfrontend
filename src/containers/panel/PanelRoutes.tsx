import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountCheckGuard } from 'src/shared/layouts/panel-layout'

const HomePage = lazy(
  () =>
    import(
      /* webpackChunkName: "home" */
      'src/pages/panel/home/HomePage'
    ),
)

const SetupCloudPage = lazy(
  () =>
    import(
      /* webpackChunkName: "setup-cloud" */
      'src/pages/panel/setup-cloud/SetupCloudPage'
    ),
)

const AccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "accounts" */
      'src/pages/panel/accounts/AccountsPage'
    ),
)

const InventoryPage = lazy(
  () =>
    import(
      /* webpackChunkName: "accounts" */
      'src/pages/panel/inventory/InventoryPage'
    ),
)

export function PanelRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route element={<AccountCheckGuard />}>
          <Route index element={<HomePage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
        <Route path="setup-cloud" element={<SetupCloudPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
