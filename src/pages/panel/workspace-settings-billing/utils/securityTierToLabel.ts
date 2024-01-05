import { t } from '@lingui/macro'
import { SecurityTier } from 'src/shared/types/server'

export const securityTierToLabel = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return t`Free`
    case 'foundational':
      return t`Foundational`
    case 'high_security':
      return t`High Security`
    default:
      return securityTier
  }
}
