import { SeverityType } from 'src/shared/types/server'
import { colorsBySeverity } from './colorsBySeverity'

export function getColorBySeverity(failedChecks: SeverityType): string
export function getColorBySeverity(failedChecks: string): string
export function getColorBySeverity(failedChecks: string) {
  switch (failedChecks) {
    case 'critical':
      return colorsBySeverity.Critical
    case 'high':
      return colorsBySeverity.High
    case 'medium':
      return colorsBySeverity.Medium
    case 'low':
      return colorsBySeverity.Low
    default:
      return colorsBySeverity.Info
  }
}
