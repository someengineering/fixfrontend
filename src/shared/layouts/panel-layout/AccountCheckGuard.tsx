import { Trans } from '@lingui/macro'
import { Button, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { getInitiated } from 'src/shared/utils/localstorage'

export const AccountCheckGuard = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountsQuery,
  })
  const navigate = useAbsoluteNavigate()

  const handleGoToSetupCloudPage = useCallback(() => {
    navigate('/setup-cloud')
  }, [navigate])

  useEffect(() => {
    if (!data.length && !getInitiated()) {
      handleGoToSetupCloudPage()
    }
  }, [data.length, handleGoToSetupCloudPage])

  if (!selectedWorkspace?.id) {
    return <FullPageLoadingSuspenseFallback />
  }

  if (!data.length) {
    return (
      <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
        <Typography variant="h3" textAlign="center">
          <Trans>There's no account configured for this workspace.</Trans>
        </Typography>
        <Typography variant="h5" textAlign="center">
          <Trans>
            Please go to{' '}
            <Button variant="text" onClick={handleGoToSetupCloudPage}>
              Setup Accounts
            </Button>{' '}
            page to setup your account first
          </Trans>
        </Typography>
      </Stack>
    )
  }

  return <Outlet />
}
