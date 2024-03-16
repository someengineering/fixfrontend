import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountCheckGuard, BenchmarkCheckGuard, SubscriptionCheckGuard } from 'src/shared/layouts/panel-layout'

const SecurityPage = lazy(
  () =>
    import(
      /* webpackChunkName: "security" */
      'src/pages/panel/security/SecurityPage'
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
      /* webpackChunkName: "inventory" */
      'src/pages/panel/inventory/InventoryPage'
    ),
)

const WorkspaceSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings" */
      'src/pages/panel/workspace-settings/WorkspaceSettingsPage'
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

export function PanelRoutes() {
  return (
    <Routes>
      <Route element={<SubscriptionCheckGuard />}>
        <Route path="/">
          <Route index element={<Navigate to="/inventory" replace />} />
          <Route element={<AccountCheckGuard />}>
            <Route element={<BenchmarkCheckGuard />}>
              <Route path="security" element={<SecurityPage />} />
              <Route path="inventory">
                <Route index element={<InventoryPage />} />
                <Route path="resource-detail/:resourceDetailId" element={<InventoryPage />} />
              </Route>
            </Route>
            <Route path="workspace-settings">
              <Route path="accounts" element={<AccountsPage />} />
            </Route>
          </Route>
          <Route path="user-settings" element={<UserSettingsPage />} />
          <Route path="workspace-settings">
            <Route index element={<WorkspaceSettingsPage />} />
            <Route path="users" element={<WorkspaceSettingsUsersPage />} />
            <Route path="billing-receipts" element={<WorkspaceSettingsBillingPage />} />
            <Route path="external-directories" element={<WorkspaceSettingsExternalDirectoryPage />} />
            <Route path="accounts">
              <Route path="setup-cloud" element={<SetupCloudPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
