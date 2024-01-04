import { PaymentMethod, SecurityTier } from 'src/shared/types/server'

export interface PutWorkspaceBillingRequest {
  security_tier: SecurityTier
  workspace_payment_method: PaymentMethod
}
