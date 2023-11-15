import { Suspense, useState } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'

export default function InventoryPage() {
  const [searchCrit, setSearchCrit] = useState('all')

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <InventoryAdvanceSearch value={searchCrit} onChange={setSearchCrit} />
        </NetworkErrorBoundary>
        <InventoryTable searchCrit={searchCrit} />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
