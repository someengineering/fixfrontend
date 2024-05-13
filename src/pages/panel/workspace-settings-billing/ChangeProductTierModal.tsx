import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { endPoints, env } from 'src/shared/constants'
import { LinkButton } from 'src/shared/link-button'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, PaymentMethodWithoutNone, PaymentMethods, ProductTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { paymentMethodToLabel, paymentMethods, productTierToLabel } from './utils'

export interface ChangeProductTierModalProps {
  productTier: ProductTier
  workspacePaymentMethods: PaymentMethod[]
  selectedWorkspacePaymentMethod: PaymentMethodWithoutNone
  selectedProductTier: ProductTier
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isUpgrade: boolean
  defaultOpen?: boolean
  nextBillingCycle: Date
  onClose?: () => void
}

export const ChangeProductTierModal = ({
  productTier,
  workspacePaymentMethods,
  selectedProductTier,
  selectedWorkspacePaymentMethod,
  showModalRef,
  isUpgrade,
  defaultOpen,
  nextBillingCycle,
  onClose,
}: ChangeProductTierModalProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(selectedWorkspacePaymentMethod)
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()

  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Product tier changed to ${selectedProductTier}`, { severity: 'success' })
    },
    onError: (err) => {
      const { response: { data } = { data: { message: '' } } } = err as AxiosError
      void showSnackbar((data as { message: string } | undefined)?.message ?? t`An error occurred, please try again later.`, {
        severity: 'error',
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['workspace-billing'],
      })
      showModalRef.current?.(false)
    },
  })
  return (
    <Modal
      defaultOpen={defaultOpen}
      openRef={showModalRef}
      onClose={onClose}
      width={800}
      actions={
        <Stack direction="row" spacing={1} justifyContent="space-between" width="100%" pt={1}>
          <Button
            variant="outlined"
            onClick={() => {
              onClose?.()
              showModalRef.current?.(false)
            }}
            color="error"
          >
            Cancel
          </Button>
          {paymentMethod.method === 'none' ? null : !paymentMethod.subscription_id ? (
            <LinkButton
              href={
                paymentMethod.method === 'aws_marketplace'
                  ? `${env.aws_marketplace_url}?product_tier=${productTier}`
                  : `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}?product_tier=${productTier}`
              }
              disabled={paymentMethod.method === 'aws_marketplace' && !env.aws_marketplace_url}
              variant="outlined"
              color="primary"
              loadingPosition="center"
              endIcon={null}
            >
              {paymentMethod.method === 'aws_marketplace' ? (
                <Trans>To AWS Marketplace</Trans>
              ) : (
                <Trans>Add a New Credit or Debit Card</Trans>
              )}
            </LinkButton>
          ) : (
            <LoadingButton
              loadingPosition="center"
              loading={changeBillingIsPending}
              color={isUpgrade ? 'success' : 'error'}
              variant="contained"
              onClick={() => {
                changeBilling({
                  product_tier: selectedProductTier,
                  workspace_payment_method: paymentMethod,
                  workspaceId: selectedWorkspace?.id ?? '',
                })
              }}
              size="large"
              sx={{ width: 180 }}
            >
              {isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
            </LoadingButton>
          )}
        </Stack>
      }
      title={t`Change Product Tier`}
      description={<Trans>You are about to change workspace's product tier</Trans>}
    >
      <Stack spacing={1} py={2}>
        <Typography component="div">
          <strong>
            <Trans>Payment method</Trans>
          </strong>
          :{' '}
          <Select
            value={paymentMethod.method}
            onChange={(e) =>
              setPaymentMethod(
                workspacePaymentMethods.find((paymentMethod) => paymentMethod.method === e.target.value) ?? {
                  method: e.target.value as PaymentMethods,
                  subscription_id: '',
                },
              )
            }
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
        </Typography>
        <Typography>
          <Trans>Current Product Tier</Trans>: {productTierToLabel(productTier)}
        </Typography>
        <Typography>
          <Trans>New Product Tier</Trans>: {productTierToLabel(selectedProductTier)}
        </Typography>
        {paymentMethod.method === 'aws_marketplace' && !paymentMethod.subscription_id ? (
          <Alert color="warning">Make sure to log in to AWS Console before proceeding.</Alert>
        ) : null}
        <Alert color="info">
          <Typography>
            <Trans>
              Info: Changes to your product tier will become active immediately and be applied for the current billing cycle!
              {isUpgrade ? null : ` ${t`Within a billing cycle you will be charged for the highest product tier that was active.`}`}
              <br />
              Your next billing cycle starts:{' '}
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
      </Stack>
    </Modal>
  )
}
