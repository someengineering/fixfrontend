import { Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { Button, Stack } from '@mui/material'
import { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from 'src/core/theme'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { AccountsTable } from './AccountsTable'

export default function AccountsPage() {
  const { mode } = useThemeMode()
  const navigate = useNavigate()

  const handleGoToSetupCloudPage = () => {
    navigate('/setup-cloud')
  }

  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <AccountsTable />
        <Stack alignItems="start" mt={-1.5} ml={1}>
          <Button startIcon={<AddIcon />} variant={mode === 'dark' ? 'outlined' : 'contained'} onClick={handleGoToSetupCloudPage}>
            <Trans>Add an account</Trans>
          </Button>
        </Stack>
      </Suspense>
    </NetworkErrorBoundary>
  )
}
