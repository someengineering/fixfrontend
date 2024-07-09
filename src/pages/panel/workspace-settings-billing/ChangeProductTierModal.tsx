import { Trans, plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { getWorkspaceCloudAccountsQuery, getWorkspaceUsersQuery } from 'src/pages/panel/shared/queries'
import { endPoints, env } from 'src/shared/constants'
import { ExternalLinkLoadingButton } from 'src/shared/link-button'
import { Modal } from 'src/shared/modal'
import { GetWorkspaceCloudAccountsResponse, GetWorkspaceProductTier, GetWorkspaceUsersResponse } from 'src/shared/types/server'
import { PaymentMethod, PaymentMethodWithoutNone, PaymentMethods, ProductTier } from 'src/shared/types/server-shared'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { paymentMethodToLabel, paymentMethods, productTierToLabel } from './utils'

export interface ChangeProductTierModalProps {
  workspacePaymentMethods: PaymentMethod[]
  selectedWorkspacePaymentMethod: PaymentMethodWithoutNone
  selectedProductTier: ProductTier
  currentProductTier: ProductTier
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isUpgrade: boolean
  defaultOpen?: boolean
  nextBillingCycle: Date
  productTierData: GetWorkspaceProductTier
  onClose?: () => void
}

export const ChangeProductTierModal = ({
  workspacePaymentMethods,
  selectedProductTier,
  currentProductTier,
  selectedWorkspacePaymentMethod,
  showModalRef,
  isUpgrade,
  defaultOpen,
  nextBillingCycle,
  productTierData,
  onClose,
}: ChangeProductTierModalProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(selectedWorkspacePaymentMethod)
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace, refreshWorkspaces } = useUserProfile()
  const [{ data: cloudAccountsLength = 0 }, { data: usersLength = 0 }] = useQueries({
    queries: [
      {
        queryFn: getWorkspaceCloudAccountsQuery,
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
        select: (data?: string | GetWorkspaceCloudAccountsResponse) =>
          typeof data === 'object'
            ? [
                ...new Set(
                  [...data.added, ...data.discovered, ...data.recent]
                    .filter((acc) => acc.enabled && acc.is_configured)
                    .map((acc) => acc.id),
                ),
              ].length
            : 0,
      },
      {
        queryFn: getWorkspaceUsersQuery,
        queryKey: ['workspace-users', selectedWorkspace?.id],
        select: (data?: GetWorkspaceUsersResponse) => data?.length ?? 0,
      },
    ],
  })
  const hasNumberOfCloudAccountLimitation = cloudAccountsLength > (productTierData.account_limit || Number.POSITIVE_INFINITY)
  const hasNumberOfUserLimitation = usersLength > (productTierData.seats_max || Number.POSITIVE_INFINITY)

  const hasLimitation = hasNumberOfCloudAccountLimitation || hasNumberOfUserLimitation
  const queryClient = useQueryClient()

  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Product tier changed to ${selectedProductTier}`, { severity: 'success' })
    },
    onError: (err) => {
      const { response: { data } = { data: { message: '' } } } = err as AxiosError<{ message?: string } | undefined>
      void showSnackbar(data?.message ?? t`An error occurred, please try again later.`, {
        severity: 'error',
        autoHideDuration: null,
      })
      onClose?.()
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['workspace-billing'],
      })
      void refreshWorkspaces()
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
            color={isUpgrade ? 'error' : undefined}
          >
            Cancel
          </Button>
          {paymentMethod.method === 'none' ? null : !paymentMethod.subscription_id ? (
            <ExternalLinkLoadingButton
              href={
                paymentMethod.method === 'aws_marketplace'
                  ? `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').awsMarketplaceProduct}?product_tier=${selectedProductTier}`
                  : `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}?product_tier=${selectedProductTier}`
              }
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
            </ExternalLinkLoadingButton>
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
              disabled={hasLimitation}
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
          <Trans>Current Product Tier</Trans>: {productTierToLabel(currentProductTier)}
        </Typography>
        <Typography>
          <Trans>New Product Tier</Trans>: {productTierToLabel(selectedProductTier)}
        </Typography>
        {paymentMethod.method === 'aws_marketplace' && !paymentMethod.subscription_id ? (
          <Alert color="warning">Make sure to log in to AWS Console before proceeding.</Alert>
        ) : null}
        <Alert color="info" icon={<InfoIcon />}>
          <Typography>
            <Trans>
              Info: Changes to your product tier will become active immediately and be applied for the current billing cycle.{' '}
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
        {hasNumberOfCloudAccountLimitation ? (
          <Alert color="warning" icon={<WarningIcon />}>
            <Typography>
              <Trans>
                You currently have{' '}
                {plural(cloudAccountsLength, {
                  one: '# enabled cloud account',
                  other: '# enabled cloud accounts',
                })}
                . There must only be{' '}
                {plural(productTierData.account_limit ?? 1, {
                  one: '# enabled cloud account',
                  other: '# enabled cloud accounts',
                })}{' '}
                in order to downgrade to the free tier.
              </Trans>
            </Typography>
          </Alert>
        ) : null}
        {hasNumberOfUserLimitation ? (
          <Alert color="warning" icon={<WarningIcon />}>
            <Typography>
              <Trans>
                You currently have{' '}
                {plural(usersLength, {
                  one: '# user',
                  other: '# users',
                })}{' '}
                attached to this workspace. There must only be{' '}
                {plural(productTierData.seats_max ?? 1, {
                  one: '# user',
                  other: '# users',
                })}{' '}
                in order to downgrade to the free tier.
              </Trans>
            </Typography>
          </Alert>
        ) : null}
      </Stack>
    </Modal>
  )
}
