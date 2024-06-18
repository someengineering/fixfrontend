import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { AwsLogo, AzureLogo, GcpLogo } from 'src/assets/icons'
import { useNonce } from 'src/shared/providers'

export default function WorkspaceSettingsAccountsSetupCloudPage() {
  const nonce = useNonce()
  return (
    <Stack
      height={{ xs: 'calc(100vh - 220px)', lg: 'calc(100vh - 220px)' }}
      maxHeight={{ xs: 'calc(100vh - 220px)', lg: 'calc(100vh - 220px)' }}
      minHeight={{ xs: 400, lg: 400 }}
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Stack direction="row" width="100%" height="100%" flex={1} flexWrap="wrap" alignItems="center" justifyContent="center">
        <Stack direction="row" width="50%" height="50%" p={1} alignItems="center" justifyContent="center">
          <Button
            component={Link}
            to="/workspace-settings/accounts/setup-cloud/aws"
            color="primary"
            sx={{
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <AwsLogo nonce={nonce} style={{ maxWidth: '500px', maxHeight: '500px' }} />
            <Typography variant="h3" textAlign="center">
              Amazon Web Services
            </Typography>
          </Button>
        </Stack>
        <Stack direction="row" width="50%" height="50%" p={1} alignItems="stretch" justifyContent="center">
          <Button
            component={Link}
            to="/workspace-settings/accounts/setup-cloud/gcp"
            color="primary"
            sx={{
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <GcpLogo nonce={nonce} style={{ maxWidth: '500px', maxHeight: '500px' }} />
            <Typography variant="h3" textAlign="center">
              Google Cloud Platform
            </Typography>
          </Button>
        </Stack>
        <Stack direction="row" width="50%" height="50%" p={1} alignItems="stretch" justifyContent="center">
          <Button
            component={Link}
            to="/workspace-settings/accounts/setup-cloud/azure"
            color="primary"
            sx={{
              borderRadius: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <AzureLogo style={{ maxWidth: '500px', maxHeight: '500px' }} />
            <Typography variant="h3" textAlign="center">
              Azure
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
