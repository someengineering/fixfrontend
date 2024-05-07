import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Alert, Divider, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { ChangePaymentMethod } from './ChangePaymentMethod'
import { WorkspaceSettingsBillingTable } from './WorkspaceSettingsBillingTable'
import { getWorkspaceBillingQuery } from './getWorkspaceBilling.query'
import { productTierToDescription, productTierToLabel } from './utils'

export default function WorkspaceSettingsBillingPage() {
  const {
    i18n: { locale },
  } = useLingui()
  const { selectedWorkspace } = useUserProfile()
  const {
    data: { product_tier, workspace_payment_method, available_payment_methods },
  } = useSuspenseQuery({ queryFn: getWorkspaceBillingQuery, queryKey: ['workspace-billing', selectedWorkspace?.id] })
  const currentDate = new Date()
  currentDate.setMilliseconds(0)
  currentDate.setSeconds(0)
  currentDate.setMinutes(0)
  currentDate.setHours(0)
  currentDate.setDate(1)
  const nextBillingCycle = new Date(currentDate.valueOf())
  nextBillingCycle.setMonth(currentDate.getMonth() + 1)
  const title = productTierToLabel(product_tier)
  const desc = productTierToDescription(product_tier)

  return desc ? (
    <Stack spacing={2}>
      <Typography variant="h3">
        <Trans>Billing</Trans>
      </Typography>
      {product_tier === 'Trial' ? (
        <Stack direction="row" justifyContent="center">
          <Alert variant="outlined" severity="success">
            <Typography variant="h5">
              <Trans>
                You are currently in your trial period, which will end in {selectedWorkspace?.trial_end_days ?? 14} days.
                <br />
                During your trial period, you have access to all features of the product.
              </Trans>
            </Typography>
          </Alert>
        </Stack>
      ) : null}
      <ChangePaymentMethod
        defaultProductTier={product_tier}
        selectedWorkspacePaymentMethod={workspace_payment_method}
        workspacePaymentMethods={available_payment_methods}
        nextBillingCycle={nextBillingCycle}
      />
      <Trans>
        <Typography>Billing cycle: {desc.monthly ? t`Monthly` : t`One time`}</Typography>
        <Typography>
          Highest product tier this billing cycle: {title}{' '}
          {desc.cloudAccounts.additionalCost
            ? t`(${desc.cloudAccounts.additionalCost.toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} / account)`
            : ''}
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
      <Divider />
      <WorkspaceSettingsBillingTable />
    </Stack>
  ) : null
}
