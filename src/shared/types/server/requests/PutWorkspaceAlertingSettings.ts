import { NotificationChannel, SeverityType } from 'src/shared/types/server'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: NotificationChannel[]
}

export type PutWorkspaceAlertingSettingsRequest = Record<string, WorkspaceAlertingSetting>
