import { Trans, t } from '@lingui/macro'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { MutableRefObject, useId, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { endPoints, env } from 'src/shared/constants'
import { LinkButton } from 'src/shared/link-button'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, PaymentMethods, ProductTier } from 'src/shared/types/server-shared'
import { paymentMethodToLabel, paymentMethods } from './utils'

export interface ChangePaymentNoMethodModalProps {
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  selectedProductTier: ProductTier
  defaultOpen?: boolean
  onClose?: () => void
}

export const ChangePaymentNoMethodModal = ({
  showModalRef,
  defaultOpen,
  selectedProductTier,
  onClose,
}: ChangePaymentNoMethodModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ method: 'stripe', subscription_id: '' })
  const id = useId()
  const { selectedWorkspace } = useUserProfile()

  return (
    <Modal
      defaultOpen={defaultOpen}
      openRef={showModalRef}
      onClose={onClose}
      actions={
        <Stack direction="row" spacing={1} justifyContent={paymentMethod.method === 'none' ? 'end' : 'space-between'} width="100%" pt={1}>
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
          {paymentMethod.method === 'none' ? null : (
            <LinkButton
              href={
                paymentMethod.method === 'aws_marketplace'
                  ? `${env.aws_marketplace_url}?product_tier=${selectedProductTier}`
                  : `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}?product_tier=${selectedProductTier}`
              }
              endIcon={null}
              loadingPosition="center"
              disabled={paymentMethod.method === 'aws_marketplace' && !env.aws_marketplace_url}
              variant="outlined"
              color="primary"
            >
              {paymentMethod.method === 'aws_marketplace' ? (
                <Trans>To AWS Marketplace</Trans>
              ) : (
                <Trans>Add a New Credit or Debit Card</Trans>
              )}
            </LinkButton>
          )}
        </Stack>
      }
      title={t`Payment Method Required`}
      description={<Trans>You need a payment method to change your product tier</Trans>}
    >
      <Typography py={2} fontWeight={600}>
        <Trans>Please add a payment method to switch your workspace's product tier</Trans>
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id={`payment-method-to-add-${id}`}>
          <Trans>Payment method to add</Trans>
        </InputLabel>
        <Select
          labelId={`payment-method-to-add-${id}`}
          value={paymentMethod.method}
          label={<Trans>Payment method to add</Trans>}
          onChange={({ target: { value } }) => setPaymentMethod({ method: value as PaymentMethods, subscription_id: '' })}
          size="small"
        >
          {paymentMethods.map((paymentMethod) => (
            <MenuItem key={paymentMethod} value={paymentMethod}>
              {paymentMethodToLabel(paymentMethod)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Modal>
  )
}
