import { GppBadFilledIcon, GppMaybeFilledIcon, VerifiedUserFilledIcon } from 'src/assets/icons'
import { SeverityType } from 'src/shared/types/server-shared'

export function getIconBySeverity(failedChecks: SeverityType): typeof VerifiedUserFilledIcon
export function getIconBySeverity(failedChecks: string): typeof VerifiedUserFilledIcon
export function getIconBySeverity(failedChecks: string) {
  switch (failedChecks.toLowerCase()) {
    case 'critical':
      return GppBadFilledIcon
    case 'high':
      return GppBadFilledIcon
    case 'medium':
      return GppMaybeFilledIcon
    case 'low':
      return GppMaybeFilledIcon
    case 'passed':
      return VerifiedUserFilledIcon
    default:
      return GppMaybeFilledIcon
  }
}
