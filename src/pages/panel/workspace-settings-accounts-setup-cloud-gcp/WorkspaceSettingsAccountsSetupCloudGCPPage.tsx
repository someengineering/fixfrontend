import { Skeleton } from '@mui/material'
import { useUserProfile } from 'src/core/auth'
import { Dropzone } from 'src/shared/dropzone'

export default function WorkspaceSettingsAccountsSetupCloudGCPPage() {
  const { selectedWorkspace } = useUserProfile()
  return selectedWorkspace?.id ? <Dropzone /> : <Skeleton />
}
