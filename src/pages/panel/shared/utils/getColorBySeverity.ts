import { colorsBySeverity } from './colorsBySeverity'

export const getColorBySeverity = (failedChecks: string) => {
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
