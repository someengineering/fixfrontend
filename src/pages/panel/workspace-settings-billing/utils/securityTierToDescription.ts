import { t } from '@lingui/macro'
import { SecurityTier } from 'src/shared/types/server'

export const securityTierToDescription = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return {
        description: t`Single-account security overview on a monthly basis.`,
        targetCustomer: t`Perfect for individual use or small-scale proof-of-concept trials.`,
        price: 0,
        oneTime: true,
        scanFrequency: t`Monthly`,
        featuresTitle: t`Free features`,
        features: [t`Basic asset inventory`, t`Compliance scans`, t`Account risk score`, t`Fix recommendations`, t`Monthly email report`],
      }
    case 'plus':
      return {
        description: t`Daily scans for secure, compliant operations.`,
        targetCustomer: t`Ideal for growing businesses that need a robust security baseline.`,
        price: 5,
        monthly: true,
        scanFrequency: t`Daily`,
        featuresTitle: t`All Free features, plus`,
        features: [t`Alerting integrations (Slack, PagerDuty, Discord)`, t`Graph visualization`, t`Inventory search`, t`CSV data export`],
      }
    case 'business':
      return {
        description: t`Hourly scans for critical, fast-paced environments.`,
        targetCustomer: t`Advanced integration for top-tier security needs and IaC support.`,
        price: 50,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`All Foundational features, plus`,
        features: [t`Alerting integrations with custom HTTP webhooks`, t`Automatic inventory exports (AWS S3)`],
      }
  }
}
