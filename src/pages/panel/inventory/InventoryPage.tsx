import { Suspense, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FixQueryProvider } from 'src/shared/fix-query-parser'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'
import { InventoryTableError } from './InventoryTable.error'
import { InventoryTemplateBoxes } from './InventoryTemplateBoxes'
import { ResourceDetail } from './resource-detail'

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useAbsoluteNavigate()
  const [hasError, setHasError] = useState(false)
  const searchCrit = searchParams.get('q') || ''
  const history = {
    change: searchParams.get('change'),
    after: searchParams.get('after'),
    before: searchParams.get('before'),
  }

  const setSearchCrit = useCallback(
    (crit?: string) => {
      if (crit === undefined) {
        return
      }
      const searchValues = getLocationSearchValues()
      searchValues['q'] = window.encodeURIComponent(crit)
      const search = mergeLocationSearchValues(searchValues)
      if (search !== window.location.search) {
        navigate({ pathname: '/inventory', search })
      }
    },
    [navigate],
  )

  const hasChanges = searchParams.get('changes') === 'true'

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <FixQueryProvider searchQuery={searchCrit}>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <InventoryAdvanceSearch
              value={searchCrit}
              onChange={setSearchCrit}
              hasError={!!searchCrit && hasError}
              hasChanges={hasChanges}
            />
          </NetworkErrorBoundary>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <ResourceDetail />
          </NetworkErrorBoundary>
          {searchCrit && (searchCrit !== 'all' || (hasChanges && history.change)) ? (
            <>
              <NetworkErrorBoundary
                fallbackRender={({ resetErrorBoundary }) => (
                  <InventoryTableError resetErrorBoundary={resetErrorBoundary} searchCrit={searchCrit} setHasError={setHasError} />
                )}
              >
                <InventoryTable
                  searchCrit={searchCrit}
                  history={
                    history.after && history.before && history.change
                      ? (history as { after: string; before: string; change: string })
                      : undefined
                  }
                />
              </NetworkErrorBoundary>
            </>
          ) : (
            <InventoryTemplateBoxes onChange={setSearchCrit} />
          )}
        </FixQueryProvider>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
