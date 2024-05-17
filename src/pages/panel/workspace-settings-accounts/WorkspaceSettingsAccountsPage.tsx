import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceSettingsAccountsTable } from './WorkspaceSettingsAccountsTable'

export default function WorkspaceSettingsAccountsPage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <WorkspaceSettingsAccountsTable />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
