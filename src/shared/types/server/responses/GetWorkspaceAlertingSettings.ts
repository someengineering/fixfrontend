import { NotificationChannel } from 'src/shared/types/server'
import { SeverityType } from './shared'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: NotificationChannel[]
}

export type GetWorkspaceAlertingSettingsResponse = Record<string, WorkspaceAlertingSetting>
