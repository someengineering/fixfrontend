import { NotificationChannel, SeverityType } from 'src/shared/types/server-shared'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: NotificationChannel[]
}

export type GetWorkspaceAlertingSettingsResponse = Record<string, WorkspaceAlertingSetting>
