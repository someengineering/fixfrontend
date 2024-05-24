import { NotificationChannel } from 'src/shared/types/server-shared'

export type WorkspaceNotificationSetting = {
  name: string
}

export type WorkspaceNotificationEmailSetting = WorkspaceNotificationSetting & {
  email: string[]
}

export type GetWorkspaceNotificationsResponse = Record<Exclude<NotificationChannel, 'email'>, WorkspaceNotificationSetting> &
  Record<'email', WorkspaceNotificationEmailSetting>
