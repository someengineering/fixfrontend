import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { AccountCheckGuard, BenchmarkCheckGuard, PermissionCheckGuard, PreLoadCheckGuard } from 'src/shared/layouts/panel-layout'

const SecurityPage = lazy(
  () =>
    import(
      /* webpackChunkName: "security" */
      'src/pages/panel/security/SecurityPage'
    ),
)

const DashboardPage = lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard" */
      'src/pages/panel/dashboard/DashboardPage'
    ),
)

const InventoryPage = lazy(
  () =>
    import(
      /* webpackChunkName: "inventory" */
      'src/pages/panel/inventory/InventoryPage'
    ),
)

const InventoryDetailView = lazy(
  () =>
    import(
      /* webpackChunkName: "inventory-detail" */
      'src/pages/panel/inventory-detail/InventoryDetailView'
    ),
)

const InventorySearchPage = lazy(
  () =>
    import(
      /* webpackChunkName: "inventory-search" */
      'src/pages/panel/inventory-search/InventorySearchPage'
    ),
)

const AccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "accounts" */
      'src/pages/panel/accounts/AccountsPage'
    ),
)

const PanelSettingsContainer = lazy(
  () =>
    import(
      /* webpackChunkName: "panel-settings-container" */
      'src/containers/panel-settings/PanelSettingsContainer'
    ),
)

const BenchmarkDetailPage = lazy(
  () =>
    import(
      /* webpackChunkName: "benchmark-detail" */
      'src/pages/panel/benchmark-detail/BenchmarkDetailPage'
    ),
)

const ResourceDetailView = lazy(
  () =>
    import(
      /* webpackChunkName: "resource-detail" */
      'src/pages/panel/resource-detail/ResourceDetailView'
    ),
)

export function PanelRoutes() {
  const withResourceDetailRoute = <Route path="resource-detail/:resourceDetailId" element={<ResourceDetailView />} />
  return (
    <Routes>
      <Route element={<PreLoadCheckGuard />}>
        <Route
          index
          element={<Navigate to={{ pathname: panelUI.homePage, search: window.location.search, hash: window.location.hash }} replace />}
        />
        <Route element={<AccountCheckGuard />}>
          <Route element={<BenchmarkCheckGuard />}>
            <Route path="security" element={<SecurityPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inventory">
              <Route path="" element={<InventoryPage key={0} />}>
                <Route path="detail/:resourceId?" element={<InventoryDetailView key={1} />} />
              </Route>
              <Route path="search" element={<InventorySearchPage key={1} />}>
                {withResourceDetailRoute}
              </Route>
              <Route path="history" element={<InventorySearchPage key={2} withHistory />}>
                {withResourceDetailRoute}
              </Route>
            </Route>
            <Route path="benchmark/:benchmarkId/:accountId?/check-detail?/:checkId?" element={<BenchmarkDetailPage />}>
              {withResourceDetailRoute}
            </Route>
          </Route>
          <Route element={<PermissionCheckGuard permissionToCheck="readSettings" />}>
            <Route path="accounts" element={<AccountsPage />} />
          </Route>
        </Route>
        <Route path="settings/*" element={<PanelSettingsContainer />} />
        <Route path="*" element={<Navigate to={panelUI.homePage} replace />} />
      </Route>
    </Routes>
  )
}
