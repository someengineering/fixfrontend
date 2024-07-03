import { useSearchParams } from 'react-router-dom'
import { ProductTier } from 'src/shared/types/server-shared'

export const useGetProductTierFromSearchParams = (): ProductTier | undefined => {
  const [search] = useSearchParams()
  const tier = search.get('tier')
  switch (tier?.toLowerCase()) {
    case 'free':
      return 'Free'
    case 'plus':
      return 'Plus'
    case 'business':
      return 'Business'
    case 'Enterprise':
      return 'Enterprise'
  }
  return undefined
}
