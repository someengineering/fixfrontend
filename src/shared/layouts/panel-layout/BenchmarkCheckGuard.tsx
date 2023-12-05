import { Trans } from '@lingui/macro'
import { Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useHasBenchmarkCheck } from './check-hooks'

export const BenchmarkCheckGuard = () => {
  const hasBenchmark = useHasBenchmarkCheck()

  return hasBenchmark ? (
    <Outlet />
  ) : (
    <Stack
      display="flex"
      flexGrow={1}
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      maxWidth="800px"
      margin="0 auto"
    >
      <Typography variant="h3" textAlign="center">
        <Trans>Security Scan in Progress</Trans>
      </Typography>
      <Typography variant="h5" mt={2} textAlign="justify">
        <Trans>
          Your cloud account has been added successfully! We are currently performing a security scan. This can take up to an hour depending
          on the size of your account. Your dashboard will be available shortly after the scan is complete.
        </Trans>
      </Typography>
    </Stack>
  )
}
