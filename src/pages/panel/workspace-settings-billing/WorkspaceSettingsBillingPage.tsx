import { Trans } from '@lingui/macro'
import { Alert, Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { ChangePaymentMethod } from './ChangePaymentMethod'
import { WorkspaceSettingsBillingTable } from './WorkspaceSettingsBillingTable'
import { getWorkspaceBillingQuery } from './getWorkspaceBilling.query'

export default function WorkspaceSettingsBillingPage() {
  const { selectedWorkspace } = useUserProfile()
  const {
    data: { payment_method, security_tier },
  } = useSuspenseQuery({ queryFn: getWorkspaceBillingQuery, queryKey: ['workspace-billing', selectedWorkspace?.id] })
  return (
    <Stack spacing={2}>
      <Typography variant="h3">
        <Trans>Billing</Trans>
      </Typography>
      <ChangePaymentMethod defaultPaymentMethod={payment_method} defaultSecurityTier={security_tier} />
      <Trans>
        <Typography>Billing cycle: monthly</Typography>
        <Typography>Highest security tier this billing cycle: High Security ($50 / account)</Typography>
        <Typography>Next invoice will be available: 2023-12-01</Typography>
      </Trans>
      <Alert color="info">
        <Typography>
          <Trans>
            Info: Changes to your security tier will become active immediately and be applied for the current billing cycle! Within a
            billing cycle you will be charged for the highest security tier that was active. Your next billing cycle starts: 2023-12-01
            00:00 UTC
          </Trans>
        </Typography>
      </Alert>
      <Divider />
      <WorkspaceSettingsBillingTable />
    </Stack>
  )
}
