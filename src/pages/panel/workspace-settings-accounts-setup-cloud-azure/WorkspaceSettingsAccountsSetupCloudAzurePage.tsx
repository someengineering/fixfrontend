import { Skeleton, Stack, Theme, useMediaQuery } from '@mui/material'
import { Suspense } from 'react'
import { WorkspaceSettingsAccountsSetupCloudAzureInstructions } from './WorkspaceSettingsAccountsSetupCloudAzureInstructions'
import { WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentials } from './WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentials'

export default function WorkspaceSettingsAccountsSetupCloudAzurePage() {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))

  return (
    <Stack direction={isMobile ? 'column-reverse' : 'row'} spacing={1}>
      <Suspense
        fallback={
          <Stack width={isMobile ? '100%' : '50%'} spacing={1} justifyContent="center" alignItems="center">
            <Skeleton width="100%" height="100%" variant="rounded" />
          </Stack>
        }
      >
        <WorkspaceSettingsAccountsSetupCloudAzureSubmitCredentials isMobile={isMobile} />
      </Suspense>
      <WorkspaceSettingsAccountsSetupCloudAzureInstructions isMobile={isMobile} />
    </Stack>
  )
}
