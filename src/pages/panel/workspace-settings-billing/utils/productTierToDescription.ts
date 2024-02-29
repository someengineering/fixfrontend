import { t } from '@lingui/macro'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BusinessIcon from '@mui/icons-material/Business'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { ProductTier } from 'src/shared/types/server'

export const productTierToDescription = (productTier: ProductTier) => {
  switch (productTier) {
    case 'free':
      return {
        description: t`For solo software engineers who want to secure a single cloud account.`,
        icon: AccessibilityNewIcon,
        cloudAccounts: { maximum: 1 },
        seats: { maximum: 1 },
        price: 0,
        monthly: false,
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
    case 'Plus':
      return {
        description: t`For growing teams looking to stay secure as they build out infrastructure.`,
        icon: WarehouseIcon,
        cloudAccounts: { minimum: 3 },
        seats: { included: 2, maximum: 20 },
        price: 30,
        monthly: true,
        scanFrequency: t`Daily`,
        featuresTitle: t`Everything in Free, and`,
        features: [t`3-month history`, t`Email alerts`, t`Weekly email report`, t`Data export (CSV, JSON, PDF)`],
      }
    case 'Business':
      return {
        description: t`For engineering teams looking to automate their cloud infrastructure security.`,
        icon: ApartmentIcon,
        cloudAccounts: { minimum: 10 },
        seats: { included: 5, maximum: 50 },
        price: 40,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`Everything in Plus, and`,
        features: [
          t`6-month history`,
          t`Custom policies (coming soon!)`,
          t`Alerting integrations (PagerDuty, Slack, Discord, Teams)`,
          t`Task management integrations (coming soon!)`,
        ],
      }
    case 'Enterprise':
      return {
        description: t`For dedicated security teams looking to build an integrated security toolchain.`,
        icon: BusinessIcon,
        cloudAccounts: { minimum: 25 },
        seats: { included: 20 },
        price: 50,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`Everything in Business, and`,
        features: [
          t`18-month history`,
          t`API access`,
          t`Custom alerting webhooks`,
          t`Single Sign on (coming soon!)`,
          t`Workspace analytics (coming soon!)`,
          t`Snowflake data export (coming soon!)`,
        ],
      }
  }
}
