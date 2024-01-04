import { PaymentMethod, SecurityTier } from 'src/shared/types/server'

export interface GetWorkspaceBillingResponse {
  available_payment_methods: PaymentMethod[]
  security_tier: SecurityTier
  workspace_payment_method: PaymentMethod[]
}
