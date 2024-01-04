import { PaymentMethods, SecurityTier } from 'src/shared/types/server'

export interface GetWorkspaceBillingResponse {
  available_payment_methods: { method: PaymentMethods }[]
  security_tier: SecurityTier
  workspace_payment_method: { method: PaymentMethods }[]
}
