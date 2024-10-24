import { Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material'
import { PowerIcon, SlackWithTextLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { endPoints } from 'src/shared/constants'
import { WorkspaceSettingsConnectedServiceItemContainer } from './WorkspaceSettingsConnectedServiceItemContainer'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'

interface WorkspaceSettingsSlackServiceProps {
  isConnected?: boolean
  isLoading?: boolean
}

export const WorkspaceSettingsSlackService = ({ isConnected, isLoading }: WorkspaceSettingsSlackServiceProps) => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')

  const theme = useTheme()
  return hasPermission || isConnected ? (
    <WorkspaceSettingsConnectedServiceItemContainer icon={<SlackWithTextLogo color={theme.palette.common.black} height={38} />}>
      {hasPermission ? (
        isConnected ? (
          <>
            <WorkspaceSettingsDisconnectServiceModal isLoading={isLoading} channel="slack" name="Slack" />
            <WorkspaceSettingsTestService channel="slack" isLoading={isLoading} />
          </>
        ) : (
          <LoadingButton
            loadingPosition={isLoading ? 'start' : undefined}
            startIcon={<PowerIcon />}
            href={endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').notification.add('slack')}
            loading={isLoading}
            variant="contained"
            color="success"
            sx={{ flexShrink: 0 }}
            disabled={!selectedWorkspace?.id}
          >
            <Trans>Connect</Trans>
          </LoadingButton>
        )
      ) : null}
    </WorkspaceSettingsConnectedServiceItemContainer>
  ) : null
}
