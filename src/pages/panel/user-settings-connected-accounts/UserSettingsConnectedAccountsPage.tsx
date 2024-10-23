import { Divider, Stack } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { UserSettingsSocialNetworkSkeleton } from './UserSettingsSocialNetwork.skeleton'
import { UserSettingsSocialNetworkList } from './UserSettingsSocialNetworkList'

export default function UserSettingsConnectedAccountsPage() {
  return (
    <Stack my={-3.75} py={1.5}>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <Suspense
          fallback={
            <>
              <UserSettingsSocialNetworkSkeleton />
              <Divider />
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
