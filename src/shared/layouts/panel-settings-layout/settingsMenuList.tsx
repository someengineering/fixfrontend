import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

export interface MenuListItem {
  name: ReactNode
  route: string
}

export const settingsRoute = `/settings`

export const routes = {
  userSettingsRoute: `${settingsRoute}/user`,
  workspaceSettingsRoute: `${settingsRoute}/workspace`,
  workspaceUsersSettingsRoute: `${settingsRoute}/workspace-users`,
}

export const titles = {
  userSettings: <Trans>User settings</Trans>,
  workspaceSettings: <Trans>Workspace settings</Trans>,
  workspaceUsersSettings: <Trans>Workspace users</Trans>,
}

export const userSettingsMenuList: MenuListItem[] = [
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

export const workspaceSettingsMenuList: MenuListItem[] = [
  {
    name: <Trans>Workspace details</Trans>,
    route: `${routes.workspaceSettingsRoute}`,
  },
  {
    name: <Trans>Connected services</Trans>,
    route: `${routes.workspaceSettingsRoute}/connected-services`,
  },
  {
    name: <Trans>Alert settings</Trans>,
    route: `${routes.workspaceSettingsRoute}/alert-settings`,
  },
  {
    name: <Trans>Billing</Trans>,
    route: `${routes.workspaceSettingsRoute}/billing-receipts`,
  },
]

export const workspaceUsersSettingsMenuList: MenuListItem[] = [
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
