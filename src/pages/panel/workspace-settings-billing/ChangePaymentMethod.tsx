import { Trans, t } from '@lingui/macro'
import DoneIcon from '@mui/icons-material/Done'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  ButtonBase,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Theme,
  Typography,
  alpha,
  useMediaQuery,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Fragment, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, SecurityTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { paymentMethodToLabel, securityTierToDescription, securityTierToLabel } from './utils'

interface ChangePaymentMethodProps {
  defaultSecurityTier: SecurityTier
  paymentMethods: PaymentMethod[]
}

const allSecurityTiers: SecurityTier[] = ['free', 'foundational', 'high_security']

const SecurityTierComp = ({ securityTier }: { securityTier: SecurityTier }) => {
  const label = securityTierToLabel(securityTier)
  const desc = securityTierToDescription(securityTier)
  if (!desc) {
    return null
  }
  const priceDesc = desc.oneTime ? t`one cloud account included` : desc.monthly ? `/ ${t`cloud account per month`}` : ''
  return (
    <Stack spacing={4} maxWidth={304}>
      <Typography variant="h4" color="primary.main">
        {label}
      </Typography>
      <Typography>
        <Typography fontWeight={700} component="span">
          {desc.description}
        </Typography>{' '}
        {desc.targetCustomer}
      </Typography>
      <Stack direction="row" my={1.5} spacing={desc.oneTime ? 1.25 : 0.75} alignItems="baseline">
        <Typography variant="h2">{desc.price.toString()}$</Typography>
        {priceDesc ? (
          <Typography variant="body2" fontWeight={600}>
            {priceDesc}*
          </Typography>
        ) : null}
      </Stack>
      <Divider />
      <Stack mt={1.5} spacing={0.75}>
        <Typography fontWeight={600}>
          <Trans>Scan frequency</Trans>
        </Typography>
        <Typography>{desc.scanFrequency}</Typography>
      </Stack>
      <Stack spacing={0.75}>
        <Typography fontWeight={600}>{desc.featuresTitle}</Typography>
        <List dense>
          {desc.features.map((feature, i) => (
            <ListItem key={i} sx={{ p: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">{feature}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Stack>
  )
}

const PaymentMethodDivider = () => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('lg'))

  return (
    <Divider
      key={isMobile.toString()}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      sx={isMobile ? { width: '100%', maxWidth: 336 } : undefined}
    />
  )
}

export const ChangePaymentMethod = ({ paymentMethods, defaultSecurityTier }: ChangePaymentMethodProps) => {
  const { selectedWorkspace } = useUserProfile()
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(paymentMethods[0])
  const [securityTier, setSecurityTier] = useState<SecurityTier>(defaultSecurityTier)

  const paymentMethodOptions = paymentMethods.map((value) => ({ label: paymentMethodToLabel(value.method), value }))

  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Payment method changed to ${paymentMethod} as ${securityTier}`, { severity: 'success' })
    },
    mutationKey: ['put-workspace-billing', selectedWorkspace?.id],
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

  const isUpgrade =
    securityTier === defaultSecurityTier ? null : allSecurityTiers.indexOf(securityTier) > allSecurityTiers.indexOf(defaultSecurityTier)

  return (
    <>
      <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ xs: 'center', lg: 'stretch' }} justifyContent="center">
        {allSecurityTiers.map((curSecurityTier, i) => (
          <Fragment key={curSecurityTier}>
            {i ? <PaymentMethodDivider /> : null}
            <ButtonBase
              LinkComponent={Stack}
              sx={{
                alignItems: 'baseline',
                textAlign: 'left',
                justifyContent: 'stretch',
                px: { xs: 2, lg: 7 },
                py: { xs: 2, lg: 2 },
                bgcolor:
                  curSecurityTier === securityTier
                    ? ({
                        palette: {
                          primary: { main },
                        },
                      }) => alpha(main, 0.15)
                    : undefined,
              }}
              onClick={() => setSecurityTier(curSecurityTier)}
            >
              <SecurityTierComp securityTier={curSecurityTier} />
            </ButtonBase>
          </Fragment>
        ))}
      </Stack>
      <Stack alignItems="center" spacing={5}>
        <Button
          color={isUpgrade === null ? undefined : isUpgrade ? 'success' : 'error'}
          variant="contained"
          disabled={isUpgrade === null}
          onClick={() => showModalRef.current?.(true)}
          endIcon={isUpgrade === null ? undefined : isUpgrade ? <UpgradeIcon /> : <TrendingDownIcon />}
        >
          {isUpgrade === null ? <Trans>Change Security Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
        </Button>
        <Typography maxWidth={587} textAlign="center">
          *{' '}
          <Trans>
            Our fair-use policy allows for up to 200,000 resources per account. If your needs surpass this amount, please{' '}
            <Link href="mailto:hi@fix.tt" target="_blank" rel="noopener noreferrer">
              reach out
            </Link>{' '}
            to discuss your specific requirements.
          </Trans>
        </Typography>
      </Stack>
      <Modal
        openRef={showModalRef}
        actions={
          <LoadingButton
            loadingPosition="end"
            loading={changeBillingIsPending}
            color={isUpgrade ? 'success' : 'error'}
            variant="contained"
            onClick={() => {
              changeBilling({
                workspace_payment_method: paymentMethod,
                security_tier: securityTier,
                workspaceId: selectedWorkspace?.id ?? '',
              })
            }}
            endIcon={isUpgrade ? <UpgradeIcon /> : <TrendingDownIcon />}
            disabled={paymentMethod.method === 'none'}
          >
            {isUpgrade === null ? <Trans>Change Security Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
          </LoadingButton>
        }
        title={t`Change payment method`}
        description={<Trans>You are about to apply changes to your billing information. Please review the new details below:</Trans>}
      >
        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <Typography>
              <Trans>Payment method</Trans>:
            </Typography>
            <Select
              value={JSON.stringify(paymentMethod)}
              onChange={(e) => setPaymentMethod(JSON.parse(e.target.value) as PaymentMethod)}
              size="small"
            >
              {paymentMethodOptions.map((paymentMethod, i) => (
                <MenuItem value={JSON.stringify(paymentMethod.value)} key={`${JSON.stringify(paymentMethod.value)}_${i}`}>
                  {paymentMethod.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Typography>
            <Trans>Security Tier</Trans>: {securityTierToLabel(securityTier)}
          </Typography>
        </Stack>
      </Modal>
      <Divider />
    </>
  )
}
