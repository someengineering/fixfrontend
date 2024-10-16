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

const WorkspaceSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings" */
      'src/pages/panel/workspace-settings/WorkspaceSettingsPage'
    ),
)

const WorkspaceSettingsAccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-accounts" */
      'src/pages/panel/workspace-settings-accounts/WorkspaceSettingsAccountsPage'
    ),
)

const WorkspaceSettingsAccountsCloudSetupPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-accounts-setup-cloud" */
      'src/pages/panel/workspace-settings-accounts-setup-cloud/WorkspaceSettingsAccountsSetupCloudPage'
    ),
)

const WorkspaceSettingsAccountsSetupCloudAWSPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-accounts-setup-cloud-aws" */
      'src/pages/panel/workspace-settings-accounts-setup-cloud-aws/WorkspaceSettingsAccountsSetupCloudAWSPage'
    ),
)

const WorkspaceSettingsAccountsSetupCloudGCPPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-accounts-setup-cloud-gcp" */
      'src/pages/panel/workspace-settings-accounts-setup-cloud-gcp/WorkspaceSettingsAccountsSetupCloudGCPPage'
    ),
)

const WorkspaceSettingsAccountsSetupCloudAzurePage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-accounts-setup-cloud-azure" */
      'src/pages/panel/workspace-settings-accounts-setup-cloud-azure/WorkspaceSettingsAccountsSetupCloudAzurePage'
    ),
)

const WorkspaceSettingsUsersPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-users" */
      'src/pages/panel/workspace-settings-users/WorkspaceSettingsUsersPage'
    ),
)

const UserSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "user-settings" */
      'src/pages/panel/user-settings/UserSettingsPage'
    ),
)

const WorkspaceSettingsBillingPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-billing" */
      'src/pages/panel/workspace-settings-billing/WorkspaceSettingsBillingPage'
    ),
)

const WorkspaceSettingsExternalDirectoryPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-external-directory" */
      'src/pages/panel/workspace-settings-external-directory/WorkspaceSettingsExternalDirectoryPage'
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
            <Route path="workspace-settings">
              <Route path="accounts" element={<WorkspaceSettingsAccountsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="user-settings" element={<UserSettingsPage />} />
        <Route element={<PermissionCheckGuard permissionToCheck="readSettings" />}>
          <Route path="workspace-settings">
            <Route index element={<WorkspaceSettingsPage />} />
            <Route path="users" element={<WorkspaceSettingsUsersPage />} />
            <Route element={<PermissionCheckGuard permissionToCheck="readBilling" />}>
              <Route path="billing-receipts" element={<WorkspaceSettingsBillingPage />} />
            </Route>
            <Route path="external-directories" element={<WorkspaceSettingsExternalDirectoryPage />} />
            <Route path="accounts">
              <Route path="setup-cloud">
                <Route index element={<WorkspaceSettingsAccountsCloudSetupPage />} />
                <Route path="aws" element={<WorkspaceSettingsAccountsSetupCloudAWSPage />} />
                <Route path="gcp" element={<WorkspaceSettingsAccountsSetupCloudGCPPage />} />
                <Route path="azure" element={<WorkspaceSettingsAccountsSetupCloudAzurePage />} />
                <Route path="*" element={<Navigate to=".." replace />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={panelUI.homePage} replace />} />
      </Route>
    </Routes>
  )
}
