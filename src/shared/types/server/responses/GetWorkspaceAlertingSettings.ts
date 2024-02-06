import { SeverityType } from './shared'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: string[]
}

export type GetWorkspaceAlertingSettingsResponse = Record<string, WorkspaceAlertingSetting>
