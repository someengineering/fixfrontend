export type WorkspaceNotificationSetting = {
  name: string
}

export type WorkspaceNotificationEmailSetting = WorkspaceNotificationSetting & {
  email: string[]
}

export type GetWorkspaceNotificationsResponse = Record<string, WorkspaceNotificationSetting> &
  Record<'email', WorkspaceNotificationEmailSetting>
