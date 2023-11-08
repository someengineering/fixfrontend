import { WorkspaceFailedChecksTypeKeys } from 'src/shared/types/server'
import { colorsBySeverity } from './colorsBySeverity'

export const getColorBySeverity = (failedChecks: WorkspaceFailedChecksTypeKeys) => {
  switch (failedChecks) {
    case 'critical':
      return colorsBySeverity.Critical
    case 'high':
      return colorsBySeverity.High
    case 'medium':
      return colorsBySeverity.Medium
    case 'low':
      return colorsBySeverity.Low
  }
}
