import { t } from '@lingui/macro'
import { SeverityType } from 'src/shared/types/server-shared'

export const sortedSeverities: SeverityType[] = ['critical', 'high', 'medium', 'low', 'info']
export const apiMessages = {
  awsMarketplaceSubscribed: 'aws-marketplace-subscribed',
  stripeSubscribed: 'stripe-subscribed',
  paymentOnHold: 'PaymentOnHold',
  workspacePaymentOnHold: 'workspace_payment_on_hold',
} as const
export const panelMessages = () =>
  [
    { message: 'aws-marketplace-subscribed', text: t`AWS Marketplace has been successfully subscribed`, type: 'success' },
    { message: 'stripe-subscribed', text: t`Credit/Debit Card has been successfully subscribed`, type: 'success', confetti: true },
  ] as const
