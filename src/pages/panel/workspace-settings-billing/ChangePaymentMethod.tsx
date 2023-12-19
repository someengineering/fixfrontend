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
  Typography,
  alpha,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Fragment, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { Modal } from 'src/shared/modal'
import { PaymentMethods, SecurityTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'

interface ChangePaymentMethodProps {
  defaultSecurityTier: SecurityTier
  defaultPaymentMethod: PaymentMethods
}

const paymentMethodToLabel = (paymentMethod: PaymentMethods) => {
  switch (paymentMethod) {
    case 'aws_marketplace':
      return t`AWS Marketplace`
    default:
      return paymentMethod
  }
}

const securityTierToLabel = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return t`Free`
    case 'foundational':
      return t`Foundational`
    case 'high_security':
      return t`High Security`
    default:
      return securityTier
  }
}

const securityTierToDescription = (securityTier: SecurityTier) => {
  switch (securityTier) {
    case 'free':
      return {
        description: t`Single-account security overview on a monthly basis.`,
        targetCustomer: t`Perfect for individual use or small-scale proof-of-concept trials.`,
        price: 0,
        oneTime: true,
        scanFrequency: t`Monthly`,
        featuresTitle: t`Free features`,
        features: [t`Basic asset inventory`, t`Compliance scans`, t`Account risk score`, t`Fix recommendations`, t`Monthly email report`],
      }
    case 'foundational':
      return {
        description: t`Daily scans for secure, compliant operations.`,
        targetCustomer: t`Ideal for growing businesses that need a robust security baseline.`,
        price: 5,
        monthly: true,
        scanFrequency: t`Daily`,
        featuresTitle: t`All Free features, plus`,
        features: [t`Alerting integrations (Slack, PagerDuty, Discord)`, t`Graph visualization`, t`Inventory search`, t`CSV data export`],
      }
    case 'high_security':
      return {
        description: t`Hourly scans for critical, fast-paced environments.`,
        targetCustomer: t`Advanced integration for top-tier security needs and IaC support.`,
        price: 50,
        monthly: true,
        scanFrequency: t`Hourly`,
        featuresTitle: t`All Foundational features, plus`,
        features: [t`Alerting integrations with custom HTTP webhooks`, t`Automatic inventory exports (AWS S3)`],
      }
  }
}

const allPaymentMethods: PaymentMethods[] = ['aws_marketplace']
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

export const ChangePaymentMethod = ({ defaultPaymentMethod, defaultSecurityTier }: ChangePaymentMethodProps) => {
  const { selectedWorkspace } = useUserProfile()
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>(defaultPaymentMethod)
  const [securityTier, setSecurityTier] = useState<SecurityTier>(defaultSecurityTier)

  const paymentMethodOptions = allPaymentMethods.map((value) => ({ label: paymentMethodToLabel(value), value }))

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
            {i ? <Divider orientation="vertical" /> : null}
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
              changeBilling({ payment_method: paymentMethod, security_tier: securityTier, workspaceId: selectedWorkspace?.id ?? '' })
            }}
            endIcon={isUpgrade ? <UpgradeIcon /> : <TrendingDownIcon />}
          >
            {isUpgrade === null ? <Trans>Change Security Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
          </LoadingButton>
        }
        title={t`Change Payment method`}
        description={<Trans>You are about to apply changes to your billing information. Please review the new details below:</Trans>}
      >
        <Stack spacing={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <Typography>
              <Trans>Payment method</Trans>:
            </Typography>
            <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethods)} size="small">
              {paymentMethodOptions.map((paymentMethod, i) => (
                <MenuItem value={paymentMethod.value} key={`${paymentMethod.value}_${i}`}>
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
