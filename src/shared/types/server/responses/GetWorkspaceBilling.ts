import { PaymentMethods, SecurityTier } from 'src/shared/types/server'

export interface GetWorkspaceBillingResponse {
  payment_method: PaymentMethods
  security_tier: SecurityTier
}
