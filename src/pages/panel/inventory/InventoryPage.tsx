import { Suspense, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'
import { InventoryTableError } from './InventoryTable.error'
import { ResourceDetail } from './ResourceDetail'

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useAbsoluteNavigate()
  const [hasError, setHasError] = useState(false)
  const searchCrit = searchParams.get('q') || 'all'
  const history = {
    change: searchParams.get('change'),
    after: searchParams.get('after'),
    before: searchParams.get('before'),
  }

  const setSearchCrit = useCallback(
    (crit?: string, hide?: string) => {
      if (crit === undefined && hide === undefined) {
        return
      }
      const searchValues = getLocationSearchValues()
      if (crit !== undefined) {
        searchValues['q'] = window.encodeURIComponent(crit)
      }
      if (hide !== undefined) {
        searchValues['hide'] = hide
      }
      const search = mergeLocationSearchValues(searchValues)
      if (search !== window.location.search) {
        navigate({ pathname: '/inventory', search })
      }
    },
    [navigate],
  )

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <InventoryAdvanceSearch value={searchCrit} onChange={setSearchCrit} hasError={hasError} />
        </NetworkErrorBoundary>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <ResourceDetail />
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
