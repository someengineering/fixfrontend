import { Trans } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Divider, Typography } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { useEvents } from 'src/core/events'
import { SetupCloudButton } from 'src/pages/panel/shared/setup-cloud-button'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { useHasBenchmarkCheck } from 'src/shared/layouts/panel-layout'
import { Tabs } from 'src/shared/tabs'
import { setInitiated } from 'src/shared/utils/localstorage'
import { ExternalId } from './ExternalId'
import { ExternalIdSkeleton } from './ExternalId.skeleton'
import { SetupTemplateButton } from './SetupTemplateButton'
import { SetupTemplateButtonSkeleton } from './SetupTemplateButton.skeleton'
import { WorkspaceId } from './WorkspaceId'

export default function WorkspaceSettingsAccountsSetupCloudAWSPage() {
  const { addListener } = useEvents()
  const navigate = useAbsoluteNavigate()
  const hasBenchmark = useHasBenchmarkCheck()

  useEffect(() => {
    setInitiated(true)
  }, [])

  useEffect(() => {
    return addListener('event-button', (ev) => {
      if (ev.kind === 'aws_account_discovered' || ev.kind === 'cloud_account_discovered') {
        navigate(hasBenchmark ? '/accounts' : '/security')
      }
    })
  }, [addListener, navigate, hasBenchmark])

  return (
    <>
      <Typography variant="h1" color="secondary" mb={2}>
        <Trans>Automatic Cloud Setup</Trans>
      </Typography>
      <Typography variant="h6">
        <Trans>In the next step we are going to set up the trust between FIX and your AWS cloud account.</Trans>
      </Typography>
      <Box mt={1}>
        <Alert color="warning" sx={{ display: 'inline-flex' }}>
          <Typography variant="h6" color="warning.main">
            <Trans>Make sure that you are already logged into the correct AWS account, before pressing the DEPLOY STACK button.</Trans>
          </Typography>
        </Alert>
      </Box>
      <Box mt={3} display="flex" flexDirection="column" justifyContent="start" height={507}>
        <Tabs
          tabs={[
            {
              id: 'deploy_to_account',
              content: (
                <Box
                  component="video"
                  controls
                  width={720}
                  height={405}
                  preload="metadata"
                  muted
                  poster={`${env.videosAssetsUrl}/deploy_to_account_poster.png`}
                >
                  <source src={`${env.videosAssetsUrl}/deploy_to_account.mp4`} type="video/mp4" />
                </Box>
              ),
              title: <Trans>Deploy to a single account</Trans>,
            },
            {
              id: 'deploy_to_org',
              content: (
                <Box
                  component="video"
                  controls
                  width={720}
                  height={405}
                  preload="metadata"
                  muted
                  poster={`${env.videosAssetsUrl}/deploy_to_org_poster.png`}
                >
                  <source src={`${env.videosAssetsUrl}/deploy_to_org.mp4`} type="video/mp4" />
                </Box>
              ),
              title: <Trans>Deploy to organization</Trans>,
            },
          ]}
        />
      </Box>
      <Box py={3}>
        <SetupCloudButton size="large" variant="contained" />
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
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Suspense fallback={<SetupTemplateButtonSkeleton />}>
              <SetupTemplateButton />
            </Suspense>
          </NetworkErrorBoundary>
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
              <Typography variant="body2" mb={{ xs: 1, md: 0 }} alignSelf={{ xs: 'start', md: 'center' }} width={100}>
                <Trans>External Id</Trans>:
              </Typography>
              <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                <Suspense fallback={<ExternalIdSkeleton />}>
                  <ExternalId />
                </Suspense>
              </NetworkErrorBoundary>
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
              <Typography variant="body2" mb={{ xs: 1, md: 0 }} alignSelf={{ xs: 'start', md: 'center' }} width={100}>
                <Trans>Workspace Id</Trans>:
              </Typography>
              <WorkspaceId />
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
