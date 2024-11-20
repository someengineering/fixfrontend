import { Stack, useMediaQuery } from '@mui/material'
import { WorkspaceSettingsAccountsSetupCloudGCPInstructions } from './WorkspaceSettingsAccountsSetupCloudGCPInstructions'
import { WorkspaceSettingsAccountsSetupCloudGCPUploadKey } from './WorkspaceSettingsAccountsSetupCloudGCPUploadKey'

export default function WorkspaceSettingsAccountsSetupCloudGCPPage() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'))

  return (
    <Stack direction={isMobile ? 'column' : 'row'} height="100%" gap={{ xs: 2.5, lg: 3.75 }}>
      <WorkspaceSettingsAccountsSetupCloudGCPUploadKey isMobile={isMobile} />
      <WorkspaceSettingsAccountsSetupCloudGCPInstructions isMobile={isMobile} />
    </Stack>
  )
}
