import { t } from '@lingui/macro'
import { SecurityTier } from 'src/shared/types/server'

export const securityTierToLabel = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return t`Free`
    case 'plus':
      return t`Plus`
    case 'business':
      return t`Business`
    default:
      return securityTier
  }
}
