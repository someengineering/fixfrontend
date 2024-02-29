import { PaymentMethod, ProductTier } from 'src/shared/types/server'

export interface GetWorkspaceBillingResponse {
  available_payment_methods: PaymentMethod[]
  security_tier: ProductTier
  workspace_payment_method: PaymentMethod
}
