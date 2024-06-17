import GppBadIcon from '@mui/icons-material/GppBad'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import { SeverityType } from 'src/shared/types/server-shared'

export function getIconBySeverity(failedChecks: SeverityType): typeof GppGoodIcon
export function getIconBySeverity(failedChecks: string): typeof GppGoodIcon
export function getIconBySeverity(failedChecks: string) {
  switch (failedChecks.toLowerCase()) {
    case 'critical':
      return GppBadIcon
    case 'high':
      return GppBadIcon
    case 'medium':
      return GppMaybeIcon
    case 'low':
      return GppMaybeIcon
    case 'passed':
      return GppGoodIcon
    default:
      return GppMaybeIcon
  }
}
