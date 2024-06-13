import { SeverityType } from 'src/shared/types/server-shared'
import { colorsBySeverity } from './colorsBySeverity'

type MaterialColorsBySeverityType = typeof colorsBySeverity

export function getColorBySeverity(failedChecks: SeverityType): MaterialColorsBySeverityType[keyof MaterialColorsBySeverityType]
export function getColorBySeverity(failedChecks: string): string
export function getColorBySeverity(failedChecks: string) {
  switch (failedChecks.toLowerCase()) {
    case 'critical':
      return colorsBySeverity.Critical
    case 'high':
      return colorsBySeverity.High
    case 'medium':
      return colorsBySeverity.Medium
    case 'low':
      return colorsBySeverity.Low
    case 'passed':
      return colorsBySeverity.Passed
    default:
      return colorsBySeverity.Info
  }
}
