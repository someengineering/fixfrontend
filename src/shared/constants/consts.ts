import { SeverityType } from 'src/shared/types/server-shared'

export const sortedSeverities: SeverityType[] = ['critical', 'high', 'medium', 'low', 'info']
export const apiMessages = {
  awsMarketplaceSubscribed: 'aws-marketplace-subscribed',
  stripeSubscribed: 'stripe-subscribed',
  paymentOnHold: 'PaymentOnHold',
  workspacePaymentOnHold: 'workspace_payment_on_hold',
} as const
