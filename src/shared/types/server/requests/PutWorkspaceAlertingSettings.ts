import { SeverityType } from 'src/shared/types/server'

export type WorkspaceAlertingSetting = {
  severity: SeverityType
  channels: string[]
}

export type PutWorkspaceAlertingSettingsRequest = Record<string, WorkspaceAlertingSetting>
