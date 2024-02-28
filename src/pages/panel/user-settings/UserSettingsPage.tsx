import { Trans } from '@lingui/macro'
import { Divider, Stack, Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { UserSettingsFormEmail } from './UserSettingsFormEmail'
import { UserSettingsFormPassword } from './UserSettingsFormPassword'
import { UserSettingsNotification } from './UserSettingsNotification'
import { UserSettingsSocialNetworkSkeleton } from './UserSettingsSocialNetwork.skeleton'
import { UserSettingsSocialNetworkList } from './UserSettingsSocialNetworkList'

export default function UserSettingsPage() {
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h3">
        <Trans>User Settings</Trans>
      </Typography>
      <Stack spacing={1} pb={2}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <UserSettingsFormEmail />
          <UserSettingsFormPassword />
        </NetworkErrorBoundary>
      </Stack>
      <Divider />
      <Typography variant="h3">
        <Trans>Notification</Trans>
      </Typography>
      <UserSettingsNotification />
      <Divider />
      <Typography variant="h3">
        <Trans>Connected Accounts</Trans>
      </Typography>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Suspense
          fallback={
            <>
              <UserSettingsSocialNetworkSkeleton />
              <UserSettingsSocialNetworkSkeleton />
            </>
          }
        >
          <UserSettingsSocialNetworkList />
        </Suspense>
      </NetworkErrorBoundary>
    </Stack>
  )
}
