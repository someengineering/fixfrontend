export type PaymentMethods = 'aws_marketplace' | 'stripe' | 'none'

export type PaymentMethodWithoutNone = { method: Exclude<PaymentMethods, 'none'>; subscription_id: string }

export type PaymentMethod = PaymentMethodWithoutNone | { method: 'none' }

export type ProductTier = 'Free' | 'Trial' | 'Plus' | 'Business' | 'Enterprise'
