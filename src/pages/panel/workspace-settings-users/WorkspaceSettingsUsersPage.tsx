import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceSettingsUsersTable } from './WorkspaceSettingsUsersTable'

export default function WorkspaceSettingsUsersPage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <WorkspaceSettingsUsersTable />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
