import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountCheckGuard, BenchmarkCheckGuard, SubscriptionCheckGuard } from 'src/shared/layouts/panel-layout'

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

const WorkspaceSettingsUserInvitesPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-user-invites" */
      'src/pages/panel/workspace-settings-user-invitations/WorkspaceSettingsUserInvitationsPage'
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
          <Route element={<AccountCheckGuard />}>
            <Route element={<BenchmarkCheckGuard />}>
              <Route index element={<HomePage />} />
              <Route path="inventory" element={<InventoryPage />} />
            </Route>

            <Route path="accounts" element={<AccountsPage />} />
          </Route>
          <Route path="workspace-settings">
            <Route index element={<WorkspaceSettingsPage />} />
            <Route path="users">
              <Route index element={<WorkspaceSettingsUsersPage />} />
              <Route path="invitations" element={<WorkspaceSettingsUserInvitesPage />} />
            </Route>
            <Route path="billing-receipts" element={<WorkspaceSettingsBillingPage />} />
            <Route path="external-directories" element={<WorkspaceSettingsExternalDirectoryPage />} />
          </Route>
          <Route path="setup-cloud" element={<SetupCloudPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
