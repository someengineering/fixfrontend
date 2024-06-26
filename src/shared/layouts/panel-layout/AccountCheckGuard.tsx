import { Trans } from '@lingui/macro'
import { Button, Stack, Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { AddAccountButton } from 'src/shared/add-account-button'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { getInitiated } from 'src/shared/utils/localstorage'
import { useHasAccountsCheck } from './check-hooks/useHasAccountsCheck'

export const AccountCheckGuard = () => {
  const { selectedWorkspace } = useUserProfile()
  const { haveError, doesNotHaveAccount, paymentOnHold } = useHasAccountsCheck()
  const navigate = useAbsoluteNavigate()

  const handleGoToSetupCloudPage = useCallback(() => {
    navigate('/workspace-settings/accounts/setup-cloud')
  }, [navigate])

  const handleGoToPaymentPage = useCallback(() => {
    navigate('/workspace-settings/billing-receipts')
  }, [navigate])

  useEffect(() => {
    if (haveError) {
      if (paymentOnHold) {
        handleGoToPaymentPage()
      }
    }
    if (doesNotHaveAccount && !getInitiated()) {
      handleGoToSetupCloudPage()
    }
  }, [paymentOnHold, doesNotHaveAccount, handleGoToPaymentPage, handleGoToSetupCloudPage, haveError])

  if (!selectedWorkspace?.id) {
    return <FullPageLoadingSuspenseFallback />
  }

  if (doesNotHaveAccount) {
    return (
      <Stack flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
        <Stack alignSelf="start" alignItems="end" flexGrow={0} flexShrink={0} width="100%">
          <AddAccountButton />
        </Stack>
        <Stack flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center" flexGrow={1} flexShrink={0}>
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
      </Stack>
    )
  }

  return <Outlet />
}
