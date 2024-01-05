import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Alert, Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { ChangePaymentMethod } from './ChangePaymentMethod'
import { WorkspaceSettingsBillingTable } from './WorkspaceSettingsBillingTable'
import { getWorkspaceBillingQuery } from './getWorkspaceBilling.query'
import { securityTierToDescription, securityTierToLabel } from './utils'

export default function WorkspaceSettingsBillingPage() {
  const {
    i18n: { locale },
  } = useLingui()
  const { selectedWorkspace } = useUserProfile()
  const {
    data: { available_payment_methods, security_tier },
  } = useSuspenseQuery({ queryFn: getWorkspaceBillingQuery, queryKey: ['workspace-billing', selectedWorkspace?.id] })
  const currentDate = new Date()
  currentDate.setMilliseconds(0)
  currentDate.setSeconds(0)
  currentDate.setMinutes(0)
  currentDate.setHours(0)
  currentDate.setDate(1)
  const nextBillingCycle = new Date(currentDate.valueOf())
  nextBillingCycle.setMonth(currentDate.getMonth() + 1)
  const title = securityTierToLabel(security_tier)
  const desc = securityTierToDescription(security_tier)

  return (
    <Stack spacing={2}>
      <Typography variant="h3">
        <Trans>Billing</Trans>
      </Typography>
      <ChangePaymentMethod paymentMethods={available_payment_methods} defaultSecurityTier={security_tier} />
      <Trans>
        <Typography>Billing cycle: {desc.monthly ? t`Monthly` : t`One time`}</Typography>
        <Typography>
          Highest security tier this billing cycle: {title} (${desc.price} / account)
        </Typography>
      </Trans>
      {desc.monthly ? (
        <Trans>
          <Typography>
            Next invoice will be available:{' '}
            {nextBillingCycle.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}
          </Typography>
        </Trans>
      ) : null}
      <Alert color="info">
        <Typography>
          <Trans>
            Info: Changes to your security tier will become active immediately and be applied for the current billing cycle! Within a
            billing cycle you will be charged for the highest security tier that was active. Your next billing cycle starts:{' '}
            {nextBillingCycle.toLocaleString(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            UTC
          </Trans>
        </Typography>
      </Alert>
      <Divider />
      <WorkspaceSettingsBillingTable />
    </Stack>
  )
}
