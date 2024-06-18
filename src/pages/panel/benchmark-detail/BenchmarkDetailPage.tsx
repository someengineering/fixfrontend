import { Stack } from '@mui/material'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { panelUI } from 'src/shared/constants'
import { BenchmarkDetailTree } from './BenchmarkDetailTree'

export default function BenchmarkDetailPage() {
  const { benchmarkId } = useParams<'benchmarkId' | 'accountId'>()

  return benchmarkId ? (
    <Stack
      spacing={1}
      height={{ xs: 'calc(100vh - 185px)', lg: 'calc(100vh - 185px)' }}
      maxHeight={{ xs: 'calc(100vh - 185px)', lg: 'calc(100vh - 185px)' }}
      minHeight={{ xs: 300, lg: 300 }}
      width="100%"
    >
      <BenchmarkDetailTree />
      <Outlet />
    </Stack>
  ) : (
    <Navigate to={{ pathname: panelUI.homePage, search: window.location.search, hash: window.location.hash }} replace />
  )
}
