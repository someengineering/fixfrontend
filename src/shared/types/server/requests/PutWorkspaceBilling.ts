import { PaymentMethod, ProductTier } from 'src/shared/types/server'

export interface PutWorkspaceBillingRequest {
  security_tier: ProductTier
  workspace_payment_method: PaymentMethod
}
