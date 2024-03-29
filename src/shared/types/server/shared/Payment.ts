export type PaymentMethods = 'aws_marketplace' | 'none'

export type PaymentMethod = { method: Exclude<PaymentMethods, 'none'>; subscription_id: string } | { method: 'none' }

export type ProductTier = 'Free' | 'Trial' | 'Plus' | 'Business' | 'Enterprise'
