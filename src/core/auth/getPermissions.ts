export const workspacePermissions = {
  create: 1 << 0, // Not currently used.
  read: 1 << 1, // Required to read any content in the workspace; without this, the workspace is effectively disabled.
  update: 1 << 2, // Update general workspace properties; not directly related to deletion or invitations.
  delete: 1 << 3, // Not currently used.
  inviteTo: 1 << 4, // Invite new members to the workspace.
  removeFrom: 1 << 5, // Remove existing members from the workspace.
  readSettings: 1 << 6, // Access to view workspace settings; necessary to display settings UI.
  updateSettings: 1 << 7, // Modify workspace settings.
  updateCloudAccounts: 1 << 8, // Manage cloud account integrations within the workspace.
  readBilling: 1 << 9, // View billing and subscription details.
  updateBilling: 1 << 10, // Modify billing and payment methods.
  readRoles: 1 << 11, // View roles of workspace members.
  updateRoles: 1 << 12, // Change roles of workspace members.
} as const

export const maxPermissionNumber = (1 << 13) - 1

export type Permissions = keyof typeof workspacePermissions

export const getPermissions = (value: number) =>
  Object.entries(workspacePermissions).reduce(
    (prev, [permKey, permValue]) => ((value & permValue) === permValue ? [...prev, permKey] : prev),
    [] as Permissions[],
  )
