import { Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { useTheme } from '@mui/material'
import { DiscordWithTextLogo, PowerIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { endPoints } from 'src/shared/constants'
import { WorkspaceSettingsConnectedServiceItemContainer } from './WorkspaceSettingsConnectedServiceItemContainer'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'

interface WorkspaceSettingsDiscordServiceProps {
  isConnected?: boolean
  isLoading?: boolean
}

export const WorkspaceSettingsDiscordService = ({ isConnected, isLoading }: WorkspaceSettingsDiscordServiceProps) => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')

  const theme = useTheme()
  return hasPermission || isConnected ? (
    <WorkspaceSettingsConnectedServiceItemContainer icon={<DiscordWithTextLogo color={theme.palette.common.black} height={38} />}>
      {hasPermission ? (
        isConnected ? (
          <>
            <WorkspaceSettingsDisconnectServiceModal channel="discord" isLoading={isLoading} name="Discord" />
            <WorkspaceSettingsTestService channel="discord" isLoading={isLoading} />
          </>
        ) : (
          <LoadingButton
            loadingPosition={isLoading ? 'start' : undefined}
            startIcon={<PowerIcon />}
            href={endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').notification.add('discord')}
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
