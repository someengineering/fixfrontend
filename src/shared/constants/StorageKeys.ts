export enum StorageKeys {
  settings = 'fix.SETTINGS',
  themeMode = 'fix.THEME_MODE',
  authData = 'fix.AUTH_DATA',
  locale = 'fix.LOCALE',
  initiated = 'fix.INITIATED',
  subscriptionId = 'fix.SUBSCRIPTION_ID',
  authenticated = 'fix.authenticated',
}

export const settingsStorageKeys = {
  AccountsTableItem: {
    rowsPerPage: 'AccountsTableItem.rowsPerPage',
  },
  InventoryTable: {
    rowsPerPage: 'InventoryTable.rowsPerPage',
  },
  WorkspaceSettingsBillingTable: {
    rowsPerPage: 'WorkspaceSettingsBillingTable.rowsPerPage',
  },
  WorkspaceSettingsUsersTable: {
    rowsPerPage: 'WorkspaceSettingsUsersTable.rowsPerPage',
  },
  WorkspaceSettingsUserInvitationsTable: {
    rowsPerPage: 'WorkspaceSettingsUserInvitationsTable.rowsPerPage',
  },
} as const

type SettingsStorageKeysInterface = typeof settingsStorageKeys
type SettingsStorageKeysPageInterface = SettingsStorageKeysInterface[keyof SettingsStorageKeysInterface]
export type SettingsStorageKeys = SettingsStorageKeysPageInterface[keyof SettingsStorageKeysPageInterface]
