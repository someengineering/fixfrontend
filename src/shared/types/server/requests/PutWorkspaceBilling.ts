import { GenericServerError, PaymentMethod, ProductTier } from 'src/shared/types/server-shared'

export interface PutWorkspaceBillingRequest {
  product_tier?: ProductTier | null
  workspace_payment_method?: PaymentMethod | null
}

export type PutWorkspaceBillingErrorResponse = GenericServerError<
  [[403, ['payment_required', 'too_many_cloud_accounts', 'too_many_users', 'unknown_payment_method', 'downgrade_not_allowed']]]
>
