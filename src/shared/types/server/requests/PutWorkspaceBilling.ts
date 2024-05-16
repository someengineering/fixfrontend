import { PaymentMethod, ProductTier } from 'src/shared/types/server'

export interface PutWorkspaceBillingRequest {
  product_tier?: ProductTier | null
  workspace_payment_method?: PaymentMethod | null
}
