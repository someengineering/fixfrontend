import { Trans } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Box, Stack, useTheme } from '@mui/material'
import { DiscordWithTextLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { endPoints } from 'src/shared/constants'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { deleteWorkspaceNotificationDiscordMutation } from './deleteWorkspaceNotificationDiscord.mutation'

interface WorkspaceSettingsDiscordServiceProps {
  isConnected?: boolean
  isLoading?: boolean
}

export const WorkspaceSettingsDiscordService = ({ isConnected, isLoading }: WorkspaceSettingsDiscordServiceProps) => {
  const { selectedWorkspace } = useUserProfile()
  const theme = useTheme()
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'space-between', sm: 'start' }}>
      <Box width={150}>
        <DiscordWithTextLogo fill={theme.palette.common.black} width={120} />
      </Box>
      {isConnected ? (
        <WorkspaceSettingsDisconnectServiceModal
          isLoading={isLoading}
          mutationFn={deleteWorkspaceNotificationDiscordMutation}
          name="Discord"
        />
      ) : (
        <LoadingButton
          loadingPosition={isLoading ? 'start' : undefined}
          startIcon={<PowerIcon />}
          href={endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').notification.add.discord}
          loading={isLoading}
          variant="contained"
          color="primary"
          sx={{ flexShrink: 0 }}
          disabled={!selectedWorkspace?.id}
        >
          <Trans>Connect</Trans>
        </LoadingButton>
      )}
    </Stack>
  )
}
