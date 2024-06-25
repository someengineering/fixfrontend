import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Alert, Divider, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { PaymentMethodWithoutNone } from 'src/shared/types/server-shared'
import { ChangeProductTier } from './ChangeProductTier'
import { ConfirmChangePaymentModal } from './ConfirmChangePaymentModal'
import { WorkspaceSettingsBillingTable } from './WorkspaceSettingsBillingTable'
import { getWorkspaceBillingQuery } from './getWorkspaceBilling.query'
import { paymentMethodToLabel, paymentMethods, productTierToDescription, productTierToLabel } from './utils'

export default function WorkspaceSettingsBillingPage() {
  const {
    i18n: { locale },
  } = useLingui()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateBilling')
  const {
    data: { product_tier, workspace_payment_method, available_payment_methods, selected_product_tier },
  } = useSuspenseQuery({
    queryFn: getWorkspaceBillingQuery,
    queryKey: ['workspace-billing', selectedWorkspace?.id],
  })
  const paymentModalShowRef = useRef<(paymentMethod: PaymentMethodWithoutNone) => void>()
  const handleOnPaymentMethodChange = (event: SelectChangeEvent<'aws_marketplace' | 'stripe'>) => {
    paymentModalShowRef.current?.({
      method: event.target.value as PaymentMethodWithoutNone['method'],
      subscription_id:
        (available_payment_methods.find((paymentMethod) => paymentMethod.method === event.target.value) as PaymentMethodWithoutNone)
          ?.subscription_id ?? '',
    })
  }
  const currentDate = new Date()
  currentDate.setMilliseconds(0)
  currentDate.setSeconds(0)
  currentDate.setMinutes(0)
  currentDate.setHours(0)
  currentDate.setDate(1)
  const nextBillingCycle = new Date(currentDate.valueOf())
  nextBillingCycle.setMonth(currentDate.getMonth() + 1)
  const title = productTierToLabel(selected_product_tier)
  const desc = productTierToDescription(selected_product_tier)

  return desc ? (
    <Stack spacing={2}>
      <Typography variant="h3">
        <Trans>Billing</Trans>
      </Typography>
      {selected_product_tier === 'Trial' ? (
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
      <ChangeProductTier
        key={product_tier + selected_product_tier}
        defaultProductTier={selected_product_tier}
        selectedWorkspacePaymentMethod={workspace_payment_method}
        workspacePaymentMethods={available_payment_methods}
        nextBillingCycle={nextBillingCycle}
      />
      {workspace_payment_method.method !== 'none' ? (
        <Typography component="div">
          <strong>
            <Trans>Payment method</Trans>
          </strong>
          :{' '}
          {hasPermission ? (
            <Select
              value={workspace_payment_method.method}
              onChange={handleOnPaymentMethodChange}
              variant="filled"
              size="small"
              hiddenLabel
              sx={{
                bgcolor: 'transparent',
              }}
              slotProps={{
                input: {
                  sx: {
                    px: 0.5,
                    py: 0.25,
                  },
                },
              }}
            >
              {paymentMethods.map((paymentMethod) => (
                <MenuItem key={paymentMethod} value={paymentMethod}>
                  {paymentMethodToLabel(paymentMethod)}
                </MenuItem>
              ))}
            </Select>
          ) : (
            paymentMethodToLabel(workspace_payment_method.method)
          )}
        </Typography>
      ) : null}

      <Typography>
        <strong>
          <Trans>Billing cycle</Trans>
        </strong>
        : {desc.monthly ? t`Monthly` : t`One time`}
      </Typography>

      <Typography>
        <strong>
          <Trans>Highest product tier this billing cycle</Trans>
        </strong>
        : {title}
      </Typography>

      {desc.monthly ? (
        <Typography>
          <strong>
            <Trans>Next invoice will be available</Trans>
          </strong>
          : {nextBillingCycle.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </Typography>
      ) : null}
      <Divider />
      <WorkspaceSettingsBillingTable />
      <ConfirmChangePaymentModal paymentModalShowRef={paymentModalShowRef} currentPaymentMethod={workspace_payment_method} />
    </Stack>
  ) : null
}
