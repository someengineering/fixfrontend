import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceSettingsUserInvitationsTable } from './WorkspaceSettingsUserInvitationsTable'

export default function WorkspaceSettingsUserInvitationsPage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <WorkspaceSettingsUserInvitationsTable />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
