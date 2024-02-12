import { t } from '@lingui/macro'
import { SecurityTier } from 'src/shared/types/server'

export const securityTierToDescription = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return {
        description: t`Single-account security overview on a monthly basis.`,
        targetCustomer: t`For solo engineers who want to secure a single cloud account.`,
        price: 0,
        oneTime: true,
        scanFrequency: t`Monthly`,
        featuresTitle: t`Features`,
        features: [
          t`1-month history`,
          t`Asset inventory`,
          t`Inventory search`,
          t`Neighborhood view`,
          t`Security benchmarks`,
          t`Monthly email report`,
          t`Remediation recommendations`,
          t`Core CSPM scanning capabilities`,
        ],
      }
    case 'plus':
      return {
        description: t`Daily scans for secure, compliant operations.`,
        targetCustomer: t`For growing teams looking to stay secure as they build out infrastructure.`,
        price: 30,
        monthly: true,
        scanFrequency: t`Daily`,
        featuresTitle: t`Everything in Free, and`,
        features: [t`3-month history`, t`Email alerts`, t`Weekly email report`, t`Data export (CSV, JSON, PDF)`],
      }
    case 'business':
      return {
        description: t`Hourly scans for critical, fast-paced environments.`,
        targetCustomer: t`For engineering teams looking to automate their cloud infrastructure security.`,
        price: 40,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`Everything in Plus, and`,
        features: [
          t`6-month history`,
          t`Custom policies`,
          t`Alerting integrations (PagerDuty, Slack, Discord, Teams)`,
          t`Task management integrations (coming soon)`,
        ],
      }
  }
}
