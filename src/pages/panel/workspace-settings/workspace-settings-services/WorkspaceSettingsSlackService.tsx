import { Trans } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Box, Stack, useTheme } from '@mui/material'
import { SlackWithTextLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { endPoints } from 'src/shared/constants'
import { WorkspaceSettingsDisconnectServiceModal } from './WorkspaceSettingsDisconnectServiceModal'
import { WorkspaceSettingsTestService } from './WorkspaceSettingsTestService'

interface WorkspaceSettingsSlackServiceProps {
  isConnected?: boolean
  isLoading?: boolean
}

export const WorkspaceSettingsSlackService = ({ isConnected, isLoading }: WorkspaceSettingsSlackServiceProps) => {
  const { selectedWorkspace } = useUserProfile()
  const theme = useTheme()
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'space-between', sm: 'start' }}>
      <Box width={150}>
        <SlackWithTextLogo fill={theme.palette.common.black} width={100} />
      </Box>
      {isConnected ? (
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
