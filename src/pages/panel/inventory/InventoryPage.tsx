import { Suspense, useCallback, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { FixQueryProvider } from 'src/shared/fix-query-parser'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceInventorySearchTableHistory, WorkspaceInventorySearchTableHistoryChanges } from 'src/shared/types/server'
import { getLocationSearchValues, mergeLocationSearchValues } from 'src/shared/utils/windowLocationSearch'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'
import { InventoryTableError } from './InventoryTable.error'
import { InventoryTemplateBoxes } from './InventoryTemplateBoxes'

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useAbsoluteNavigate()
  const [hasError, setHasError] = useState(false)
  const searchCrit = searchParams.get('q') || ''
  const history = {
    changes: (searchParams.get('changes')?.split(',') ?? []) as WorkspaceInventorySearchTableHistoryChanges[],
    after: searchParams.get('after') || undefined,
    before: searchParams.get('before') || undefined,
  }

  const handleSetSearchCrit = useCallback(
    (crit?: string) => {
      const searchValues = getLocationSearchValues()
      if (!crit) {
        setHasError(false)
        delete searchValues['q']
      } else {
        searchValues['q'] = window.encodeURIComponent(crit)
      }
      const search = mergeLocationSearchValues(searchValues)
      if (search !== window.location.search) {
        navigate({ pathname: window.location.pathname, search })
      }
    },
    [navigate],
  )

  const handleSetHistory = useCallback(
    (history?: WorkspaceInventorySearchTableHistory) => {
      const searchValues = getLocationSearchValues()
      if (!history || !history.changes.length) {
        delete searchValues['changes']
        delete searchValues['after']
        delete searchValues['before']
      } else {
        searchValues['changes'] = window.encodeURIComponent(history.changes.join(','))
        if (history.after) {
          searchValues['after'] = window.encodeURIComponent(history.after)
        } else {
          delete searchValues['after']
        }
        if (history.before) {
          searchValues['before'] = window.encodeURIComponent(history.before)
        } else {
          delete searchValues['before']
        }
      }
      const search = mergeLocationSearchValues(searchValues)
      if (search !== window.location.search) {
        navigate({ pathname: window.location.pathname, search })
      }
    },
    [navigate],
  )

  const hasChanges = !!history.changes.length

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <FixQueryProvider searchQuery={searchCrit} history={history} onHistoryChange={handleSetHistory} onChange={handleSetSearchCrit}>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <InventoryAdvanceSearch hasError={!!searchCrit && hasError} hasChanges={hasChanges} />
          </NetworkErrorBoundary>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Outlet />
          </NetworkErrorBoundary>
          {searchCrit || hasChanges || hasError ? (
            <>
              <NetworkErrorBoundary
                fallbackRender={({ resetErrorBoundary }) => (
                  <InventoryTableError resetErrorBoundary={resetErrorBoundary} searchCrit={searchCrit} setHasError={setHasError} />
                )}
              >
                <InventoryTable searchCrit={searchCrit} history={history.changes.length ? history : undefined} />
              </NetworkErrorBoundary>
            </>
          ) : (
            <InventoryTemplateBoxes onChange={handleSetSearchCrit} />
          )}
        </FixQueryProvider>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
