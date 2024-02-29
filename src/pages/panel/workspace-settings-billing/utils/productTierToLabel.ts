import { t } from '@lingui/macro'
import { ProductTier } from 'src/shared/types/server'

export const productTierToLabel = (productTier: ProductTier) => {
  switch (productTier) {
    case 'free':
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
