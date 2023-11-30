import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'
import { InventoryTableError } from './InventoryTable.error'

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const initialized = useRef(false)
  const navigate = useAbsoluteNavigate()
  const [hasError, setHasError] = useState(false)
  const [searchCrit, setSearchCrit] = useState(() => searchParams.get('q') || 'all')
  const history = {
    change: searchParams.get('change'),
    after: searchParams.get('after'),
    before: searchParams.get('before'),
  }

  useEffect(() => {
    if (initialized.current) {
      navigate({
        pathname: '/inventory',
        search: `q=${window.encodeURIComponent(searchCrit)}`,
      })
    }
    initialized.current = true
  }, [searchCrit, navigate])

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
