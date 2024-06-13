import { SeverityType } from 'src/shared/types/server-shared'
import { materialColorsBySeverity } from './materialColorsBySeverity'

type MaterialColorsBySeverityType = typeof materialColorsBySeverity

export function getMaterialColorBySeverity(failedChecks: SeverityType): MaterialColorsBySeverityType[keyof MaterialColorsBySeverityType]
export function getMaterialColorBySeverity(failedChecks: string): string
export function getMaterialColorBySeverity(failedChecks: string) {
  switch (failedChecks.toLowerCase()) {
    case 'critical':
      return materialColorsBySeverity.Critical
    case 'high':
      return materialColorsBySeverity.High
    case 'medium':
      return materialColorsBySeverity.Medium
    case 'low':
      return materialColorsBySeverity.Low
    case 'passed':
      return materialColorsBySeverity.Passed
    default:
      return materialColorsBySeverity.Info
  }
}
