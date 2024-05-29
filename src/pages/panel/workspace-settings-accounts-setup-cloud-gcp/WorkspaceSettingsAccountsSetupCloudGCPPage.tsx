import { Stack, Theme, useMediaQuery } from '@mui/material'
import { WorkspaceSettingsAccountsSetupCloudGCPInstructions } from './WorkspaceSettingsAccountsSetupCloudGCPInstructions'
import { WorkspaceSettingsAccountsSetupCloudGCPUploadKey } from './WorkspaceSettingsAccountsSetupCloudGCPUploadKey'

export default function WorkspaceSettingsAccountsSetupCloudGCPPage() {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))

  // TODO: fix layout in a way that the content can be easily set to maximize height
  return (
    <Stack direction={isMobile ? 'column-reverse' : 'row'} spacing={1} height={isMobile ? undefined : 'calc(100vh - 235px)'}>
      <WorkspaceSettingsAccountsSetupCloudGCPUploadKey isMobile={isMobile} />
      <WorkspaceSettingsAccountsSetupCloudGCPInstructions isMobile={isMobile} />
    </Stack>
  )
}
