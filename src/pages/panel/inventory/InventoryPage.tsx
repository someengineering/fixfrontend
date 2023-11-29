import { Stack, Typography } from '@mui/material'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { TableViewPage } from 'src/shared/layouts/panel-layout'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { InventoryAdvanceSearch } from './InventoryAdvanceSearch'
import { InventoryTable } from './InventoryTable'

const TableNetworkErrorBoundary = ({ resetErrorBoundary, searchCrit }: { resetErrorBoundary: () => void; searchCrit: string }) => {
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) {
      resetErrorBoundary()
    }
    initialized.current = true
  }, [searchCrit, resetErrorBoundary])
  return (
    <TableViewPage>
      <Stack flex={1} height="100%" alignItems="center" justifyContent="center">
        <Typography variant="h3" color="error.main">
          Wrong query
        </Typography>
      </Stack>
    </TableViewPage>
  )
}

export default function InventoryPage() {
  const [searchParams] = useSearchParams()
  const initialized = useRef(false)
  const navigate = useAbsoluteNavigate()
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
          <InventoryAdvanceSearch value={searchCrit} onChange={setSearchCrit} />
        </NetworkErrorBoundary>
        <NetworkErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <TableNetworkErrorBoundary resetErrorBoundary={resetErrorBoundary} searchCrit={searchCrit} />
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
