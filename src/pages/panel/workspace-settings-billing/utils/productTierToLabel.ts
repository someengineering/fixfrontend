import { t } from '@lingui/macro'
import { ProductTier } from 'src/shared/types/server-shared'

export const productTierToLabel = (productTier: ProductTier) => {
  switch (productTier) {
    case 'Trial':
      return t`Trial`
    case 'Free':
      return t`Free`
    case 'Plus':
      return t`Plus`
    case 'Business':
      return t`Business`
    case 'Enterprise':
      return t`Enterprise`
    default:
      return productTier
  }
}
