import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { LegendView } from 'src/shared/legend-view'
import { InternalLink } from 'src/shared/link-button'

export const getSlides = (onClose: () => void) => [
  {
    header: <Trans>Infrastructure Overview</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The Infrastructure Overview dashboard provides a high-level snapshot of your multi-cloud environment, helping you understand
            your resource distribution and recent changes. You get a bird's eye view of the state of your infrastructure and can quickly
            assess the scale and complexity of your cloud(s).
          </Typography>
          <LegendView component={Stack} spacing={1.5}>
            <Typography variant="h6">The dashboard has three components:</Typography>
            <ul>
              <Typography variant="subtitle1" component="li">
                Asset summary by cloud
              </Typography>
              <Typography variant="subtitle1" component="li">
                Resources over time
              </Typography>
              <Typography variant="subtitle1" component="li">
                Assets by region
              </Typography>
            </ul>
          </LegendView>
          <Typography variant="subtitle1">
            With the Infrastructure Overview, you can maintain a comprehensive view of your multi-cloud environment, enabling better
            decision-making for security, compliance, and optimization efforts.
          </Typography>
          <Typography variant="subtitle1">
            Click{' '}
            <Typography variant="subtitle1" color="primary" component="span" fontWeight={700}>
              "next"
            </Typography>{' '}
            to learn more about each component.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
  {
    header: <Trans>Asset Summary</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The Resources chart is a chronological view of new, updated, and deleted resources, with a time-picker to zoom into certain
            periods. The data in the timeline chart helps you track recent changes to your infrastructure.
          </Typography>
          <LegendView component={Stack} spacing={1.5}>
            <Typography variant="h6">Use case include:</Typography>
            <ul>
              <Typography variant="subtitle1" component="li">
                Detect unexpected resource growth
              </Typography>
              <Typography variant="subtitle1" component="li">
                Identify potential cost optimization opportunities
              </Typography>
              <Typography variant="subtitle1" component="li">
                Ensure compliance with account and region limits
              </Typography>
            </ul>
          </LegendView>
          <Typography variant="subtitle1">
            The dashboard will show data for the cloud accounts that Fix is collecting data for. You can add more cloud accounts in{' '}
            <InternalLink to="/workspace-settings" onClick={onClose}>
              Workspace Settings
            </InternalLink>
            .
          </Typography>
        </Trans>
      </Stack>
    ),
  },
  {
    header: <Trans>Resource Timeline</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The Resources chart is a chronological view of new, updated, and deleted resources, with a time-picker to zoom into certain
            periods. The data in the timeline chart helps you track recent changes to your infrastructure.
          </Typography>
          <LegendView component={Stack} spacing={1.5}>
            <Typography variant="h6">Use case include:</Typography>
            <ul>
              <Typography variant="subtitle1" component="li">
                Investigate unexpected modifications
              </Typography>
              <Typography variant="subtitle1" component="li">
                Audit resource lifecycle management
              </Typography>
              <Typography variant="subtitle1" component="li">
                Correlate infrastructure changes with security events
              </Typography>
            </ul>
          </LegendView>
          <Typography variant="subtitle1">
            For more detailed information on resources and the changes, see the{' '}
            <InternalLink to="/inventory/search" onClick={onClose}>
              Explorer tab
            </InternalLink>
            .
          </Typography>
        </Trans>
      </Stack>
    ),
  },
  {
    header: <Trans>Assets by region</Trans>,
    content: (
      <Stack spacing={2.5}>
        <Trans>
          <Typography variant="subtitle1">
            The assets by region is a world map that displays active regions and resource counts and visualizes the geographical
            distribution of your cloud resources.
          </Typography>
          <LegendView component={Stack} spacing={1.5}>
            <Typography variant="h6">Use case include:</Typography>
            <ul>
              <Typography variant="subtitle1" component="li">
                Ensure compliance with data residency requirements
              </Typography>
              <Typography variant="subtitle1" component="li">
                Optimize resource placement for latency and redundancy
              </Typography>
              <Typography variant="subtitle1" component="li">
                Identify unused or underutilized regions
              </Typography>
            </ul>
          </LegendView>
          <Typography variant="subtitle1">
            For more detailed information on resources in each region, see the{' '}
            <InternalLink to="/inventory" onClick={onClose}>
              Inventory
            </InternalLink>{' '}
            and{' '}
            <InternalLink to="/inventory/search" onClick={onClose}>
              Explorer
            </InternalLink>{' '}
            tabs.
          </Typography>
        </Trans>
      </Stack>
    ),
  },
]
