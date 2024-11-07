import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { useHasAccountsCheck, usePermissionCheck } from 'src/shared/layouts/panel-layout'

export interface MenuListItem {
  name: ReactNode
  useGuard?: () => boolean
  route: string
}

const settingsRoute = `/settings`

const routes = {
  userSettingsRoute: `${settingsRoute}/user`,
  workspaceSettingsRoute: `${settingsRoute}/workspace`,
  workspaceUsersSettingsRoute: `${settingsRoute}/workspace-users`,
}

const titles = {
  userSettings: <Trans>User settings</Trans>,
  workspaceSettings: <Trans>Workspace settings</Trans>,
  workspaceUsersSettings: <Trans>Workspace users</Trans>,
}

const userSettingsMenuList: MenuListItem[] = [
  {
    name: <Trans>User details</Trans>,
    route: `${routes.userSettingsRoute}`,
  },
  {
    name: <Trans>Notifications</Trans>,
    route: `${routes.userSettingsRoute}/notification`,
  },
  {
    name: <Trans>Connected accounts</Trans>,
    route: `${routes.userSettingsRoute}/connected-accounts`,
  },
  {
    name: <Trans>API tokens</Trans>,
    route: `${routes.userSettingsRoute}/api-tokens`,
  },
]

const useGuardForAlertSettings = () => {
  const { doesNotHaveAccount, haveError, paymentOnHold } = useHasAccountsCheck()
  return !doesNotHaveAccount && !haveError && !paymentOnHold
}

const useGuardForBilling = () => {
  const hasPermission = usePermissionCheck('readBilling')
  return hasPermission
}

const workspaceSettingsMenuList: MenuListItem[] = [
  {
    name: <Trans>Workspace details</Trans>,
    route: `${routes.workspaceSettingsRoute}`,
  },
  {
    name: <Trans>Connected services</Trans>,
    useGuard: useGuardForAlertSettings,
    route: `${routes.workspaceSettingsRoute}/connected-services`,
  },
  {
    name: <Trans>Alert settings</Trans>,
    useGuard: useGuardForAlertSettings,
    route: `${routes.workspaceSettingsRoute}/alert-settings`,
  },
  {
    name: <Trans>Billing</Trans>,
    useGuard: useGuardForBilling,
    route: `${routes.workspaceSettingsRoute}/billing-receipts`,
  },
]

const workspaceUsersSettingsMenuList: MenuListItem[] = [
  {
    name: <Trans>Current users</Trans>,
    route: `${routes.workspaceUsersSettingsRoute}`,
  },
  {
    name: <Trans>Pending invitations</Trans>,
    route: `${routes.workspaceUsersSettingsRoute}/pending-invitations`,
  },
]

export const settingsMenu = [
  {
    id: 'user',
    title: titles.userSettings,
    list: userSettingsMenuList,
    route: routes.userSettingsRoute,
  },
  {
    id: 'workspace',
    title: titles.workspaceSettings,
    list: workspaceSettingsMenuList,
    route: routes.workspaceSettingsRoute,
  },
  {
    id: 'workspaceUser',
    title: titles.workspaceUsersSettings,
    list: workspaceUsersSettingsMenuList,
    route: routes.workspaceUsersSettingsRoute,
  },
]
