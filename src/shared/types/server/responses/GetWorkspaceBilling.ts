import { PaymentMethod, ProductTier } from 'src/shared/types/server-shared'

export interface GetWorkspaceBillingResponse {
  available_payment_methods: PaymentMethod[]
  product_tier: ProductTier
  selected_product_tier: ProductTier
  workspace_payment_method: PaymentMethod
}
