import { Trans } from '@lingui/macro'
import PowerIcon from '@mui/icons-material/Power'
import { LoadingButton } from '@mui/lab'
import { Stack, useTheme } from '@mui/material'
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
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateSettings')

  const theme = useTheme()
  return hasPermission || isConnected ? (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent={{ xs: 'center', sm: 'start' }}
      minHeight={40}
      flexWrap="wrap"
      gap={2}
    >
      <Stack width={150} justifyContent="center">
        <SlackWithTextLogo fill={theme.palette.common.black} width={100} />
      </Stack>
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
            color="primary"
            sx={{ flexShrink: 0 }}
            disabled={!selectedWorkspace?.id}
          >
            <Trans>Connect</Trans>
          </LoadingButton>
        )
      ) : null}
    </Stack>
  ) : null
}
