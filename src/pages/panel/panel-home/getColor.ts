import { WorkspaceFailedChecksTypeKeys } from 'src/shared/types/server'

export const getColorByScore = (score: number) => {
  if (score <= 50) {
    return 'error' as const
  } else if (score <= 90) {
    return 'warning' as const
  }
  return 'success' as const
}

export const getColorBySeverity = (failedChecks: WorkspaceFailedChecksTypeKeys) => {
  switch (failedChecks) {
    case 'critical':
    case 'high':
      return 'error' as const
    case 'medium':
      return 'warning' as const
    case 'low':
      return 'success' as const
  }
}
