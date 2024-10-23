import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { PermissionCheckGuard } from 'src/shared/layouts/panel-layout'

const UserSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "user-settings" */
      'src/pages/panel/user-settings/UserSettingsPage'
    ),
)

const UserSettingsNotificationsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "user-settings-notifications" */
      'src/pages/panel/user-settings-notifications/UserSettingsNotificationsPage'
    ),
)

const UserSettingsConnectedAccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "user-settings-connected-accounts" */
      'src/pages/panel/user-settings-connected-accounts/UserSettingsConnectedAccountsPage'
    ),
)

const UserSettingsAPITokensPage = lazy(
  () =>
    import(
      /* webpackChunkName: "user-settings-api-tokens" */
      'src/pages/panel/user-settings-api-token/UserSettingsAPITokensPage'
    ),
)

const WorkspaceSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings" */
      'src/pages/panel/workspace-settings/WorkspaceSettingsPage'
    ),
)

const WorkspaceSettingsConnectedServicesPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-connected-services" */
      'src/pages/panel/workspace-settings-connected-services/WorkspaceSettingsConnectedServicesPage'
    ),
)

const WorkspaceSettingsAlertSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-alert-settings" */
      'src/pages/panel/workspace-settings-alert-settings/WorkspaceSettingsAlertSettingsPage'
    ),
)

const WorkspaceSettingsBillingPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-settings-billing" */
      'src/pages/panel/workspace-settings-billing/WorkspaceSettingsBillingPage'
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

const WorkspaceUsersSettingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-users-settings" */
      'src/pages/panel/workspace-users-settings/WorkspaceUsersSettingsPage'
    ),
)

const WorkspaceUsersSettingsPendingInvitationsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "workspace-users-settings-pending-invitations" */
      'src/pages/panel/workspace-users-settings-pending-invitations/WorkspaceUsersSettingsPendingInvitationsPage'
    ),
)

export function PanelSettingsRoutes() {
  const { hash, search } = window.location
  return (
    <Routes>
      <Route index element={<Navigate to={{ pathname: panelUI.homePage, search, hash }} replace />} />
      <Route path="user">
        <Route index element={<UserSettingsPage />} />
        <Route path="notification" element={<UserSettingsNotificationsPage />} />
        <Route path="connected-accounts" element={<UserSettingsConnectedAccountsPage />} />
        <Route path="api-tokens" element={<UserSettingsAPITokensPage />} />
      </Route>
      <Route element={<PermissionCheckGuard permissionToCheck="readSettings" />}>
        <Route path="workspace">
          <Route index element={<WorkspaceSettingsPage />} />
          <Route element={<PermissionCheckGuard permissionToCheck="readBilling" />}>
            <Route path="billing-receipts" element={<WorkspaceSettingsBillingPage />} />
          </Route>
          <Route path="connected-services" element={<WorkspaceSettingsConnectedServicesPage />} />
          <Route path="alert-settings" element={<WorkspaceSettingsAlertSettingsPage />} />
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
      <Route path="workspace-users">
        <Route index element={<WorkspaceUsersSettingsPage />} />
        <Route path="pending-invitations" element={<WorkspaceUsersSettingsPendingInvitationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={{ pathname: panelUI.homePage, search, hash }} replace />} />
    </Routes>
  )
}
