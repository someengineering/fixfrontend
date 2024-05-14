import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { Modal } from 'src/shared/modal'
import { ProductTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { productTierToLabel } from './utils'

export interface ChangeProductTierModalProps {
  productTier: ProductTier
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  defaultOpen?: boolean
  nextBillingCycle: Date
  onClose?: () => void
}

export const ChangeProductTierToFreeModal = ({
  showModalRef,
  defaultOpen,
  nextBillingCycle,
  productTier,
  onClose,
}: ChangeProductTierModalProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()

  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Product tier changed to Free`, { severity: 'success' })
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
          <LoadingButton
            loadingPosition="center"
            loading={changeBillingIsPending}
            color="error"
            variant="contained"
            onClick={() => {
              changeBilling({
                product_tier: 'Free',
                workspace_payment_method: { method: 'none' },
                workspaceId: selectedWorkspace?.id ?? '',
              })
            }}
            size="large"
            sx={{ width: 180 }}
          >
            <Trans>Downgrade</Trans>
          </LoadingButton>
        </Stack>
      }
      title={t`Change Product Tier`}
      description={<Trans>You are about to change workspace's product tier</Trans>}
    >
      <Stack spacing={1} py={2}>
        <Typography>
          <Trans>Current Product Tier</Trans>: {productTierToLabel(productTier)}
        </Typography>
        <Typography>
          <Trans>New Product Tier</Trans>: {productTierToLabel('Free')}
        </Typography>
        <Alert color="info">
          <Typography>
            <Trans>
              Info: Changes to your product tier will become active immediately and be applied for the current billing cycle!{' '}
              {t`Within a billing cycle you will be charged for the highest product tier that was active.`}
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
