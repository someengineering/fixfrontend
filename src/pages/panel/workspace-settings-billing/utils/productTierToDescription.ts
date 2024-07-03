import { t } from '@lingui/macro'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BusinessIcon from '@mui/icons-material/Business'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { ProductTier } from 'src/shared/types/server-shared'

export const productTierToDescription = (productTier: ProductTier) => {
  switch (productTier) {
    case 'Trial':
    case 'Free':
      return {
        description: t`For solo software engineers who want to secure a single cloud account.\n`,
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
        support: [t`Community support`],
        mostPopular: false,
      }
    case 'Plus':
      return {
        description: t`For growing teams looking to stay secure as they build out infrastructure.\n`,
        icon: WarehouseIcon,
        cloudAccounts: { included: 3, additionalCost: 30 },
        seats: { included: 2, maximum: 20 },
        price: 90,
        monthly: true,
        scanFrequency: t`Daily`,
        featuresTitle: t`Everything in Free, and`,
        features: [t`3-month history`, t`Email alerts`, t`Weekly email report`, t`Data export (CSV, JSON, PDF)`],
        support: [t`Product support via email`],
        mostPopular: false,
      }
    case 'Business':
      return {
        description: t`For engineering teams looking to automate their cloud infrastructure security.`,
        icon: ApartmentIcon,
        cloudAccounts: { included: 10, additionalCost: 40 },
        seats: { included: 5, maximum: 50 },
        price: 400,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`Everything in Plus, and`,
        features: [
          t`6-month history`,
          t`Custom policies (coming soon!)`,
          t`Alerting integrations (PD, Slack, Discord, Teams)`,
          t`Task management integrations (coming soon!)`,
        ],
        support: [t`Product support via email and live chat`],
        mostPopular: true,
      }
    case 'Enterprise':
      return {
        description: t`For dedicated security teams looking to build an integrated security toolchain.`,
        icon: BusinessIcon,
        cloudAccounts: { included: 25, additionalCost: 50 },
        seats: { included: 20 },
        price: 1250,
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
        support: [
          t`Product support via email, live chat, and video call`,
          t`Integration advice for your specific cloud environment via video call`,
          t`Optional professional services`,
        ],
        mostPopular: false,
      }
  }
}
