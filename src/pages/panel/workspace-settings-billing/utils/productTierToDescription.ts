import { t } from '@lingui/macro'
import { AccessibilityNewIcon, ApartmentIcon } from 'src/assets/icons'
import { ProductTier } from 'src/shared/types/server-shared'

export const productTierToDescription = (productTier: ProductTier) => {
  switch (productTier) {
    case 'Trial':
    case 'Free':
      return {
        description: t`Start your cloud compliance journey.\n`,
        icon: AccessibilityNewIcon,
        monthly: false,
        featuresTitle: t`Features`,
        features: [
          t`Cloud Inventory`,
          t`Compliance Benchmarks`,
          // t`Neighborhood View`,
          // t`Security benchmarks`,
          // t`Monthly email report`,
          // t`Remediation recommendations`,
          // t`Core CSPM scanning capabilities`,
          // t`Email alerts`,
        ],
        support: [t`Community support`],
        mostPopular: false,
      }
    case 'Business':
      return {
        description: t`Automate cloud infrastructure security.`,
        icon: ApartmentIcon,
        monthly: true,
        featuresTitle: t`Everything in Free, and`,
        features: [
          // t`Weekly email report`,
          t`Audit History`,
          t`Monitoring and Alerting`,
          t`Data Export`,
          t`API Access`,
          t`CLI Access`,
          // t`Custom policies (coming soon!)`,
          // t`Task management integrations (coming soon!)`,
          // t`Single Sign on (coming soon!)`,
          // t`Workspace analytics (coming soon!)`,
          // t`Snowflake data export (coming soon!)`,
        ],
        support: [
          t`Product support via email, live chat, and video call`,
          t`Integration advice for your specific cloud environment via video call`,
          t`Optional professional services`,
        ],
        mostPopular: true,
      }
  }
}
