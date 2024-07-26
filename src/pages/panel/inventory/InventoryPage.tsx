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
import { allHistoryChangesOptions } from './inventory-form/utils/allHistoryChangesOptions'

interface InventoryPageProps {
  withHistory?: boolean
}

const getSearchCrit = (crit?: string, history?: WorkspaceInventorySearchTableHistory) => {
  const searchValues = getLocationSearchValues()
  if (!crit) {
    delete searchValues['q']
  } else {
    searchValues['q'] = window.encodeURIComponent(crit)
  }
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
  return mergeLocationSearchValues(searchValues)
}

export default function InventoryPage({ withHistory }: InventoryPageProps) {
  const [searchParams] = useSearchParams()
  const navigate = useAbsoluteNavigate()
  const [hasError, setHasError] = useState(false)
  const searchCrit = searchParams.get('q') || ''
  const history = withHistory
    ? {
        changes: (searchParams.get('changes')?.split(',') ?? []) as WorkspaceInventorySearchTableHistoryChanges[],
        after: searchParams.get('after') || undefined,
        before: searchParams.get('before') || undefined,
      }
    : {
        changes: [] as WorkspaceInventorySearchTableHistoryChanges[],
      }

  const handleSetSearchCrit = useCallback(
    (crit?: string, history?: WorkspaceInventorySearchTableHistory) => {
      if (!crit) {
        setHasError(false)
      }
      const search = getSearchCrit(crit, history)
      if (search !== window.location.search) {
        navigate({ pathname: window.location.pathname, search })
      }
    },
    [navigate],
  )

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <FixQueryProvider
          withHistory={withHistory}
          allHistory={allHistoryChangesOptions}
          searchQuery={searchCrit}
          history={history}
          onChange={handleSetSearchCrit}
        >
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <InventoryAdvanceSearch hasError={!!searchCrit && hasError} hasChanges={withHistory ?? false} />
          </NetworkErrorBoundary>
          <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <Outlet />
          </NetworkErrorBoundary>
          {(!withHistory && searchCrit) || (withHistory && history.changes.length) || hasError ? (
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
            <InventoryTemplateBoxes onChange={handleSetSearchCrit} withHistory={withHistory} />
          )}
        </FixQueryProvider>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
