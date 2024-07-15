import { t } from '@lingui/macro'
import { AxiosError } from 'axios'
import { PutWorkspaceBillingErrorResponse } from 'src/shared/types/server'

export const changeProductTierErrorResponseToMessage = (error?: AxiosError<PutWorkspaceBillingErrorResponse & { message?: string }>) => {
  const detail = error?.response?.data?.detail ?? error?.response?.data?.message
  switch (detail) {
    case 'downgrade_not_allowed':
      return t`Removal of payment method not permitted: Active payment is essential for paid product tiers. Consider switching to the free product tier or contact support for further guidance.`
    case 'payment_required':
      return t`Payment update failed: The provided payment method is unrecognized. Please verify your details and use a supported payment method.`
    case 'too_many_cloud_accounts':
      return t`Product tier downgrade not available: Excessive cloud accounts exceed the limits for the desired product tier. Please deactivate or remove excess cloud accounts and attempt the downgrade again.`
    case 'too_many_users':
      return t`Product tier downgrade not available: User count exceeds the limits for the desired product tier. Please reduce the number of users and try again.`
    case 'unknown_payment_method':
      return t`Payment method unrecognized: Ensure you are using a payment method that is supported by our system.`
  }
  return detail
}
