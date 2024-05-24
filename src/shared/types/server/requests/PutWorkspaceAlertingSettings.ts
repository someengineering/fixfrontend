import { NotificationChannel, SeverityType } from 'src/shared/types/server-shared'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: NotificationChannel[]
}

export type PutWorkspaceAlertingSettingsRequest = Record<string, WorkspaceAlertingSetting>
