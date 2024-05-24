import { Trans, t } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { endPoints, env } from 'src/shared/constants'
import { LinkButton } from 'src/shared/link-button'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, PaymentMethodWithoutNone } from 'src/shared/types/server-shared'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { paymentMethodToLabel } from './utils'

interface ConfirmChangePaymentModalProps {
  currentPaymentMethod: PaymentMethod
  paymentModalShowRef: MutableRefObject<((paymentMethod: PaymentMethodWithoutNone) => void) | undefined>
}

export const ConfirmChangePaymentModal = ({ paymentModalShowRef, currentPaymentMethod }: ConfirmChangePaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ method: 'none' })
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()
  const showModalRef = useRef<(show?: boolean) => void>()
  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Payment method changed to ${paymentMethodToLabel(paymentMethod.method)}`, { severity: 'success' })
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
  useEffect(() => {
    paymentModalShowRef.current = (selectedPaymentMethod: PaymentMethodWithoutNone) => {
      if (showModalRef.current) {
        showModalRef.current(true)
        setPaymentMethod(selectedPaymentMethod)
      }
    }
  }, [paymentModalShowRef])
  return (
    <Modal
      openRef={showModalRef}
      width={800}
      actions={
        <Stack direction="row" spacing={1} justifyContent="space-between" width="100%" pt={1}>
          <Button
            variant="outlined"
            onClick={() => {
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
                  ? `${env.aws_marketplace_url}`
                  : `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}`
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
              variant="contained"
              onClick={() => {
                changeBilling({
                  workspace_payment_method: paymentMethod,
                  workspaceId: selectedWorkspace?.id ?? '',
                })
              }}
              size="large"
              sx={{ width: 180 }}
            >
              <Trans>Change payment</Trans>
            </LoadingButton>
          )}
        </Stack>
      }
      title={t`Change Payment method`}
      description={<Trans>You are about to change workspace's payment method</Trans>}
    >
      <Box py={2}>
        <Trans>
          Are you sure you want to change payment from <strong>{paymentMethodToLabel(currentPaymentMethod.method)}</strong> to{' '}
          <strong>{paymentMethodToLabel(paymentMethod.method)}</strong>?
        </Trans>
      </Box>
    </Modal>
  )
}
