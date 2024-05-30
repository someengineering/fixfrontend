import { RecursiveValueExtractor } from 'src/shared/types/shared'

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
  SetupTemplateButtonComponent: {
    acknowledge: 'SetupTemplateButtonComponent.acknowledge',
  },
  WorkspaceSettingsAccountsSetupCloudGCP: {
    activeStep: 'WorkspaceSettingsAccountsSetupCloudGCP.activeStep',
  },
} as const

export type SettingsStorageKey = RecursiveValueExtractor<typeof settingsStorageKeys>
