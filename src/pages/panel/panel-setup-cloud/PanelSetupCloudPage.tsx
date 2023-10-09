import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Skeleton, Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { ExternalId, ExternalIdSkeleton } from './ExternalId'
import { SetupCloudButton } from './SetupCloudButton'
import { SetupTemplateButton, SetupTemplateButtonSkeleton } from './SetupTemplateButton'
import { TenantId } from './TenantId'

export default function PanelSetupCloudPage() {
  return (
    <>
      <Typography variant="h1" color="secondary" mb={2}>
        <Trans>Automatic Cloud Setup</Trans>
      </Typography>
      <Typography variant="h6">
        <Trans>In the next step we are going to set up the trust between FIX and your AWS cloud account.</Trans>
      </Typography>
      <Typography variant="h6" color="warning.main" mt={1}>
        <Trans>Make sure that you are already logged into the correct AWS account, before pressing the SETUP button.</Trans>
      </Typography>
      <Box py={3}>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={
              <Skeleton variant="rounded">
                <Button>
                  <Trans>Deploy Stack</Trans>
                </Button>
              </Skeleton>
            }
          >
            <SetupCloudButton />
          </Suspense>
        </ErrorBoundary>
      </Box>
      <Typography variant="body1" my={1}>
        <Trans>
          This will deploy a CloudFormation stack that creates a new IAM role in your AWS account. This role will be used by FIX to perform
          security scans in your AWS account.
        </Trans>
      </Typography>
      <Divider />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="manual-setup-content" id="manual-setup-header">
          <Typography variant="h5">
            <Trans>Alternatively: Manual Cloud Setup</Trans>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" mt={1}>
            <Trans>Alternatively if you would like to deploy the stack manually, you can use the following CloudFormation template</Trans>:
          </Typography>
          <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Suspense fallback={<SetupTemplateButtonSkeleton />}>
              <SetupTemplateButton />
            </Suspense>
          </ErrorBoundary>
          <Typography variant="body1" mt={1}>
            <Trans>The Stack requires the following parameters</Trans>:
          </Typography>
          <div>
            <Box
              display={{ xs: 'inline-flex', md: 'flex' }}
              py={2}
              flexDirection={{ xs: 'column', md: 'row' }}
              alignItems="center"
              alignSelf="center"
            >
              <Typography variant="body1" mb={{ xs: 1, md: 0 }} alignSelf={{ xs: 'start', md: 'center' }} width={100}>
                <Trans>External Id</Trans>:
              </Typography>
              <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                <Suspense fallback={<ExternalIdSkeleton />}>
                  <ExternalId />
                </Suspense>
              </ErrorBoundary>
            </Box>
          </div>
          <div>
            <Box
              display={{ xs: 'inline-flex', md: 'flex' }}
              py={2}
              flexDirection={{ xs: 'column', md: 'row' }}
              alignItems="center"
              alignSelf="center"
            >
              <Typography variant="body1" mb={{ xs: 1, md: 0 }} alignSelf={{ xs: 'start', md: 'center' }} width={100}>
                <Trans>Tenant Id</Trans>:
              </Typography>
              <TenantId />
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  )
}