import { Trans } from '@lingui/macro'
import { Box, Divider, IconButton, Stack, styled, Tooltip, Typography } from '@mui/material'
import { Suspense, useEffect } from 'react'
import { CorporateFareIcon, FoundationIcon, WarningIcon } from 'src/assets/icons'
import { useEvents } from 'src/core/events'
import { SetupCloudButton } from 'src/pages/panel/shared/setup-cloud-button'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { env, panelUI } from 'src/shared/constants'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { useHasBenchmarkCheck } from 'src/shared/layouts/panel-layout'
import { Tabs } from 'src/shared/tabs'
import { setInitiated } from 'src/shared/utils/localstorage'
import { ExternalId } from './ExternalId'
import { ExternalIdSkeleton } from './ExternalId.skeleton'
import { SetupTemplateButton } from './SetupTemplateButton'
import { SetupTemplateButtonSkeleton } from './SetupTemplateButton.skeleton'
import { WorkspaceId } from './WorkspaceId'

const Container = styled(Stack)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2.5),
  margin: theme.spacing(2.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.common.white,
  width: '100%',
  gap: theme.spacing(3),
  [theme.breakpoints.up('lg')]: {
    margin: theme.spacing(3.75),
    padding: theme.spacing(3.75),
  },
}))

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
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3.75} px={{ xs: undefined, xl: 14.75 }} width="100%" justifyContent="center">
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            <Trans>Automatic Cloud Setup</Trans>
          </Typography>
          <Tooltip
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  width: 352,
                  p: 1.5,
                  maxWidth: '100%',
                  bgcolor: 'info.main',
                  color: 'common.white',
                },
              },
            }}
            title={
              <Typography variant="subtitle2">
                <Trans>Make sure that you are already logged into the correct AWS account, before pressing the DEPLOY STACK button.</Trans>
              </Typography>
            }
          >
            <IconButton color="warning">
              <WarningIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="body2">
          <Trans>In this step we will set up the trust between FIX and your AWS cloud account.</Trans>
        </Typography>
        <Tabs
          tabs={[
            {
              id: 'deploy_to_account',
              content: (
                <Box
                  component="video"
                  controls
                  width="100%"
                  preload="metadata"
                  muted
                  poster={`${env.videosAssetsUrl}/deploy_to_account_poster.png`}
                >
                  <source src={`${env.videosAssetsUrl}/deploy_to_account.mp4`} type="video/mp4" />
                </Box>
              ),
              title: (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <FoundationIcon fill="currentColor" />
                  <Typography variant="buttonLarge" component="p">
                    <Trans>Deploy to a single account</Trans>
                  </Typography>
                </Stack>
              ),
            },
            {
              id: 'deploy_to_org',
              content: (
                <Box
                  component="video"
                  controls
                  width="100%"
                  preload="metadata"
                  muted
                  poster={`${env.videosAssetsUrl}/deploy_to_org_poster.png`}
                >
                  <source src={`${env.videosAssetsUrl}/deploy_to_org.mp4`} type="video/mp4" />
                </Box>
              ),
              title: (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <CorporateFareIcon fill="currentColor" />
                  <Typography variant="buttonLarge" component="p">
                    <Trans>Deploy to a single account</Trans>
                  </Typography>
                </Stack>
              ),
            },
          ]}
        />
        <SetupCloudButton size="large" variant="contained" fullWidth sx={{ height: 44 }} />
        <Typography variant="body1" my={1}>
          <Trans>
            This will deploy a CloudFormation stack that creates a new IAM role in your AWS account. This role will be used by FIX to
            perform security scans in your AWS account.
          </Trans>
        </Typography>
      </Container>
      <Container>
        <Typography variant="h4">
          <Trans>Manual Cloud Setup</Trans>
        </Typography>
        <Stack spacing={2}>
          <Typography variant="body2">
            <Trans>Alternatively if you would like to deploy the stack manually, you can use the following CloudFormation template</Trans>:
          </Typography>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Suspense fallback={<SetupTemplateButtonSkeleton />}>
              <SetupTemplateButton />
            </Suspense>
          </NetworkErrorBoundary>
        </Stack>
        <Divider />
        <Typography variant="h5">
          <Trans>The Stack requires the following parameters</Trans>:
        </Typography>
        <Stack spacing={1.25}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: panelUI.uiThemePalette.text.sub }}>
            <Trans>External Id</Trans>:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
              <Suspense fallback={<ExternalIdSkeleton />}>
                <ExternalId />
              </Suspense>
            </NetworkErrorBoundary>
          </Stack>
        </Stack>
        <Stack spacing={1.25}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: panelUI.uiThemePalette.text.sub }}>
            <Trans>Workspace Id</Trans>:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <WorkspaceId />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  )
}
