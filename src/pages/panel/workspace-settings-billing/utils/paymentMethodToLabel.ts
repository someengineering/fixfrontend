import { t } from '@lingui/macro'
import { PaymentMethods } from 'src/shared/types/server'

export const paymentMethodToLabel = (paymentMethod: PaymentMethods) => {
  switch (paymentMethod) {
    case 'aws_marketplace':
      return t`AWS Marketplace`
    case 'stripe':
      return t`Credit or Debit Card`
    case 'none':
      return t`Nothing`
    default:
      return paymentMethod
  }
}
