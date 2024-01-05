export type PaymentMethods = 'aws_marketplace' | 'none'

export type PaymentMethod = { method: Exclude<PaymentMethods, 'none'>; subscription_id: string } | { method: 'none' }

export type SecurityTier = 'free' | 'foundational' | 'high_security'
