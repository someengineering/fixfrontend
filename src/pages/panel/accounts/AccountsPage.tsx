import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { AccountsTable } from './AccountsTable'

export default function AccountsPage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <AccountsTable />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
