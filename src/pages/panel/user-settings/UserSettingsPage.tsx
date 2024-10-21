import { Stack } from '@mui/material'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { UserSettingsFormEmail } from './UserSettingsFormEmail'
import { UserSettingsFormPassword } from './UserSettingsFormPassword'
import { UserSettingsTotp } from './UserSettingsTotp'

export default function UsersSettingsPage() {
  return (
    <Stack spacing={3.75}>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <UserSettingsFormEmail />
      </NetworkErrorBoundary>
      <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <UserSettingsFormPassword />
      </NetworkErrorBoundary>
      <UserSettingsTotp />
    </Stack>
  )
}
