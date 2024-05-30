import { Stack, Theme, useMediaQuery } from '@mui/material'
import { WorkspaceSettingsAccountsSetupCloudGCPInstructions } from './WorkspaceSettingsAccountsSetupCloudGCPInstructions'
import { WorkspaceSettingsAccountsSetupCloudGCPUploadKey } from './WorkspaceSettingsAccountsSetupCloudGCPUploadKey'

export default function WorkspaceSettingsAccountsSetupCloudGCPPage() {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))

  return (
    <Stack direction={isMobile ? 'column-reverse' : 'row'} spacing={1}>
      <WorkspaceSettingsAccountsSetupCloudGCPUploadKey isMobile={isMobile} />
      <WorkspaceSettingsAccountsSetupCloudGCPInstructions isMobile={isMobile} />
    </Stack>
  )
}
