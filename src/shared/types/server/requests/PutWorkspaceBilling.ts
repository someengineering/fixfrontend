import { PaymentMethods, SecurityTier } from 'src/shared/types/server'

export interface PutWorkspaceBillingRequest {
  payment_method: PaymentMethods
  security_tier: SecurityTier
}
