import { Suspense, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'
import { InventoryTableError } from './InventoryTable.error'

export default function InventoryPage() {
  const [searchParams, setSeachParams] = useSearchParams()
  const [hasError, setHasError] = useState(false)
  const searchCrit = searchParams.get('q') || 'all'
  const history = {
    change: searchParams.get('change'),
    after: searchParams.get('after'),
    before: searchParams.get('before'),
  }

  const setSearchCrit = useCallback(
    (crit: string) => {
      setSeachParams((prev) => {
        if (crit !== prev.get('q')) {
          prev.set('q', crit)
        }
        return prev
      })
    },
    [setSeachParams],
  )

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <InventoryAdvanceSearch value={searchCrit} onChange={setSearchCrit} hasError={hasError} />
        </NetworkErrorBoundary>
        <NetworkErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <InventoryTableError resetErrorBoundary={resetErrorBoundary} searchCrit={searchCrit} setHasError={setHasError} />
          )}
        >
          <InventoryTable
            searchCrit={searchCrit}
            history={
              history.after && history.before && history.change ? (history as { after: string; before: string; change: string }) : undefined
            }
          />
        </NetworkErrorBoundary>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
