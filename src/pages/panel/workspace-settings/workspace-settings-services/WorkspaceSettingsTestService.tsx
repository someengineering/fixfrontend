import { Trans } from '@lingui/macro'
import BugReportIcon from '@mui/icons-material/BugReport'
import { LoadingButton } from '@mui/lab'
import { useMutation } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { NotificationChannel } from 'src/shared/types/server'
import { postWorkspaceNotificationTestMutation } from './postWorkspaceNotificationTest.mutation'

interface WorkspaceSettingsTestServiceProps {
  channel: NotificationChannel
  isLoading?: boolean
}

export const WorkspaceSettingsTestService = ({ channel, isLoading }: WorkspaceSettingsTestServiceProps) => {
  const { selectedWorkspace } = useUserProfile()
  const { mutate, isPending } = useMutation({
    mutationFn: postWorkspaceNotificationTestMutation,
  })
  const handleTest = () => {
    if (selectedWorkspace?.id) {
      mutate({ workspaceId: selectedWorkspace.id, channel })
    }
  }

  return (
    <>
      <LoadingButton
        loadingPosition={isLoading || isPending ? 'start' : undefined}
        startIcon={<BugReportIcon />}
        loading={isLoading || isPending}
        color="inherit"
        variant="contained"
        sx={{ flexShrink: 0 }}
        onClick={handleTest}
      >
        <Trans>Test</Trans>
      </LoadingButton>
    </>
  )
}
