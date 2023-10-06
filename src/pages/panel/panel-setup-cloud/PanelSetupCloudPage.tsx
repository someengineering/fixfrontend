import { Trans } from '@lingui/macro'
import { Box, Button, Divider, Skeleton, Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from 'src/shared/error-boundary-fallback'
import { ExternalId } from './ExternalId'
import { SetupCloudButton } from './SetupCloudButton'
import { TenantId } from './TenantId'

export default function PanelSetupCloudPage() {
  return (
    <>
      <Typography variant="h1" color="secondary" mb={2}>
        <Trans>Setup cloud</Trans>
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
                  <Trans>Go To Setup</Trans>
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
      <Typography variant="subtitle2" mt={1}>
        <Trans>Alternatively if you would like to deploy the stack manually, you can use the following CloudFormation template</Trans>:
        <Button href="https://fix-aws-integration.s3.amazonaws.com/fix-aws-integration.yaml" target="_blank" variant="text">
          https://fix-aws-integration.s3.amazonaws.com/fix-aws-integration.yaml
        </Button>
      </Typography>
      <Typography variant="body1" mt={1}>
        <Trans>The Stack requires the following parameters</Trans>:
      </Typography>
      <Box display="flex" py={2} alignItems="center">
        <Typography variant="body1">
          <Trans>External Id</Trans>:
        </Typography>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense
            fallback={
              <Box ml={2}>
                <Skeleton variant="rectangular" width={376} height={52} />
              </Box>
            }
          >
            <ExternalId />
          </Suspense>
        </ErrorBoundary>
      </Box>
      <Box display="flex" py={2} alignItems="center">
        <Typography variant="body1">
          <Trans>Tenant Id</Trans>:
        </Typography>
        <TenantId />
      </Box>
    </>
  )
}
