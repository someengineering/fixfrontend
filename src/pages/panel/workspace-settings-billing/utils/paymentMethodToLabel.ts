import { t } from '@lingui/macro'
import { PaymentMethods } from 'src/shared/types/server'

export const paymentMethodToLabel = (paymentMethod: PaymentMethods) => {
  switch (paymentMethod) {
    case 'aws_marketplace':
      return t`AWS Marketplace`
    case 'none':
      return t`Please select a payment method`
    default:
      return paymentMethod
  }
}
