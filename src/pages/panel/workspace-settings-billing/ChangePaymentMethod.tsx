import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DoneIcon from '@mui/icons-material/Done'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Theme,
  Typography,
  alpha,
  useMediaQuery,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Fragment, MutableRefObject, useMemo, useRef, useState } from 'react'
import { AwsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { endPoints, env } from 'src/shared/constants'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, ProductTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { productTierToDescription, productTierToLabel, useGetProductTierFromSearchParams } from './utils'

interface ChangePaymentMethodProps {
  selectedWorkspacePaymentMethod: PaymentMethod
  workspacePaymentMethods: PaymentMethod[]
  defaultProductTier: ProductTier
  nextBillingCycle: Date
}

const allProductTiers: readonly ProductTier[] = ['Free', 'Plus', 'Business', 'Enterprise'] as const

interface ProductTierCompProps {
  productTier: ProductTier
}

const ProductTierComp = ({ productTier }: ProductTierCompProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const label = productTierToLabel(productTier)
  const desc = productTierToDescription(productTier)
  if (!desc) {
    return null
  }
  return (
    <Stack spacing={4} width={216} height="100%">
      <Typography component={Stack} direction="row" alignContent="center" variant="h4" color="primary.main">
        <Box mr={1.5} display="inline-block">
          <desc.icon />
        </Box>
        {label}
      </Typography>
      <Typography>
        <Typography fontWeight={500} component="span">
          {desc.description}
        </Typography>{' '}
      </Typography>
      <Stack direction="column" my={1.5} spacing={0.25} alignItems="baseline">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="h3" fontWeight={700} lineHeight="1.5rem" letterSpacing="-.025em" fontSize="1.875rem !important">
            {desc.price.toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </Typography>
          {desc.monthly ? (
            <Typography variant="h6" fontWeight={600} lineHeight="1.5rem" fontSize="1.125rem !important" marginTop=".125rem !important">
              <Trans>/ month</Trans>
            </Typography>
          ) : null}
        </Stack>
        {desc.cloudAccounts.maximum ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`maximum of ${desc.cloudAccounts.maximum} cloud accounts`}
          </Typography>
        ) : desc.cloudAccounts.included ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`${desc.cloudAccounts.included} cloud accounts included`}
          </Typography>
        ) : (
          <Box height="1.5rem" />
        )}
        {desc.cloudAccounts.additionalCost ? (
          <Typography
            variant="subtitle1"
            fontSize="1rem !important"
            lineHeight="1.5rem"
            fontWeight={400}
            color={({ palette }) => (palette.mode === 'dark' ? palette.grey[400] : palette.grey[700])}
          >
            {t`(${desc.cloudAccounts.additionalCost.toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} / month per additional account)`}
          </Typography>
        ) : (
          <Box height="3rem" />
        )}
      </Stack>
      <Divider />
      <Stack mt={1.5} spacing={0.75}>
        <Typography>
          <Trans>{desc.scanFrequency} scans</Trans>
        </Typography>
        <Typography>
          {desc.seats.included ? (
            <Trans>
              {desc.seats.included} seats included {desc.seats.maximum ? t`(${desc.seats.maximum} max)` : ''}
            </Trans>
          ) : (
            <Trans>{desc.seats.maximum} seat max</Trans>
          )}
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        <Typography fontWeight={600}>{desc.featuresTitle}:</Typography>
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
      <Stack justifyContent="end" flexGrow={1}>
        <Stack height={155} spacing={0.75}>
          <Typography fontWeight={600}>Support:</Typography>
          <List dense>
            {desc.support.map((support, i) => (
              <ListItem key={i} sx={{ p: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">{support}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Stack>
  )
}

const PaymentMethodDivider = () => {
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Divider
      key={isMobile.toString()}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      sx={isMobile ? { width: '100%', my: 4, maxWidth: 336 } : undefined}
    />
  )
}

interface ChangePaymentMethodModal {
  selectedWorkspacePaymentMethod: PaymentMethod
  awsPaymentMethod?: PaymentMethod
  stripePaymentMethod?: PaymentMethod
  productTier: ProductTier
  selectedProductTier: ProductTier
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  noWorkspaceMethod: boolean
  isUpgrade: boolean
  defaultOpen?: boolean
  nextBillingCycle: Date
  onClose?: () => void
}

const ChangePaymentMethodModal = ({
  productTier,
  selectedProductTier,
  selectedWorkspacePaymentMethod,
  // awsPaymentMethod,
  stripePaymentMethod,
  showModalRef,
  noWorkspaceMethod,
  isUpgrade,
  defaultOpen,
  nextBillingCycle,
  onClose,
}: ChangePaymentMethodModal) => {
  const {
    i18n: { locale },
  } = useLingui()
  const [paymentMethod, _setPaymentMethod] = useState<PaymentMethod>(
    selectedWorkspacePaymentMethod ?? { method: 'stripe', subscription_id: stripePaymentMethod },
  )
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
          <Button variant="outlined" onClick={() => showModalRef.current?.(false)}>
            Cancel
          </Button>
          {!noWorkspaceMethod ? (
            <LoadingButton
              loadingPosition="end"
              loading={changeBillingIsPending}
              color={isUpgrade ? 'success' : 'error'}
              variant="contained"
              onClick={() => {
                changeBilling({
                  product_tier: selectedProductTier,
                  workspaceId: selectedWorkspace?.id ?? '',
                })
              }}
              size="large"
              sx={{ width: 180 }}
              disabled={paymentMethod.method === 'none' || !paymentMethod.subscription_id}
              endIcon={<></>}
            >
              {isUpgrade === null ? <Trans>Change Product Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
            </LoadingButton>
          ) : null}
        </Stack>
      }
      title={noWorkspaceMethod ? t`Payment Method Required` : t`Change product tier`}
      description={noWorkspaceMethod ? null : <Trans>You are about to change workspace's product tier</Trans>}
    >
      {/* <FormControl>
        <InputLabel id="payment_method" color="primary" sx={{ color: 'primary.main' }} size="small">
          <Trans>Payment method</Trans>
        </InputLabel>
        <Select
          defaultOpen={selectedWorkspacePaymentMethod.method === 'none'}
          size="small"
          value={paymentMethod.method === 'none' ? '' : paymentMethod.method}
          labelId="payment_method"
          label={t`Payment method`}
          onChange={(e) => {
            setPaymentMethod(
              e.target.value === 'aws_marketplace'
                ? awsPaymentMethod ?? { method: 'aws_marketplace', subscription_id: '' }
                : e.target.value === 'stripe'
                  ? stripePaymentMethod ?? { method: 'stripe', subscription_id: '' }
                  : { method: 'none' },
            )
          }}
          autoFocus
          inputProps={{
            autoFocus: true,
          }}
        >
          <MenuItem value="aws_marketplace" disabled>
            <Trans>AWS Marketplace</Trans>
          </MenuItem>
          <MenuItem value="stripe">
            <Trans>Credit/Debit card</Trans>
          </MenuItem>
        </Select>
      </FormControl> */}
      {paymentMethod.method === 'none' ? (
        <Typography>
          <Trans>You need a payment method to upgrade your plan.</Trans>
        </Typography>
      ) : (
        <Stack spacing={1} py={2}>
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
      )}
    </Modal>
  )
}

interface ChangePaymentNoMethodModalProps {
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  defaultOpen?: boolean
}

const ChangePaymentNoMethodModal = ({ showModalRef, defaultOpen }: ChangePaymentNoMethodModalProps) => {
  const [paymentMethod, _setPaymentMethod] = useState<PaymentMethod>({ method: 'stripe', subscription_id: '' })
  const { selectedWorkspace } = useUserProfile()

  return (
    <Modal
      defaultOpen={defaultOpen}
      openRef={showModalRef}
      actions={
        <>
          {paymentMethod.method === 'none' ? null : (
            <Button
              href={
                paymentMethod.method === 'aws_marketplace'
                  ? env.aws_marketplace_url
                  : `${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}`
              }
              disabled={paymentMethod.method === 'aws_marketplace' && !env.aws_marketplace_url}
              variant="outlined"
              color="primary"
              endIcon={<OpenInNewIcon />}
            >
              {paymentMethod.method === 'aws_marketplace' ? <Trans>To AWS Marketplace</Trans> : <Trans>Add Credit/Debit card</Trans>}
            </Button>
          )}
        </>
      }
      title={t`Payment Method Required`}
      description={<Trans>You need a payment method to change your product tier</Trans>}
    >
      <Trans>Please add a payment method in order to change the workspace's product tier</Trans>
    </Modal>
  )
}

export const ChangePaymentMethod = ({
  defaultProductTier,
  selectedWorkspacePaymentMethod,
  workspacePaymentMethods,
  nextBillingCycle,
}: ChangePaymentMethodProps) => {
  const { selectedWorkspace } = useUserProfile()
  const tierFromSearchParams = useGetProductTierFromSearchParams()
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const showNoMethodModalRef = useRef<(show?: boolean | undefined) => void>()
  const [productTier, setProductTier] = useState<ProductTier>(() => tierFromSearchParams ?? defaultProductTier)

  const isUpgrade =
    productTier === defaultProductTier || (defaultProductTier === 'Trial' && productTier === 'Free')
      ? null
      : allProductTiers.indexOf(productTier) > allProductTiers.indexOf(defaultProductTier)

  const [awsMarketPlacePaymentMethod, stripePaymentMethod] = useMemo(() => {
    let awsMarketPlacePaymentMethod: PaymentMethod | undefined
    let stripePaymentMethod: PaymentMethod | undefined
    workspacePaymentMethods.forEach((paymentMethod) => {
      if (paymentMethod.method === 'aws_marketplace') {
        awsMarketPlacePaymentMethod = paymentMethod
      } else if (paymentMethod.method === 'stripe') {
        stripePaymentMethod = paymentMethod
      }
    })
    return [awsMarketPlacePaymentMethod, stripePaymentMethod]
  }, [workspacePaymentMethods])

  const noWorkspaceMethod = !stripePaymentMethod // && !awsMarketPlacePaymentMethod

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" alignItems={{ xs: 'center', sm: 'stretch' }} justifyContent="center">
        {allProductTiers.map((curProductTier, i) => {
          const selectedProductTier = curProductTier === productTier || (productTier === 'Trial' && curProductTier === 'Free')
          return (
            <Fragment key={curProductTier}>
              {i ? <PaymentMethodDivider /> : null}
              <ButtonBase
                LinkComponent={Stack}
                sx={{
                  alignItems: 'baseline',
                  textAlign: 'left',
                  justifyContent: 'stretch',
                  px: { xs: 2, lg: 4 },
                  py: { xs: 2, lg: 4 },
                  bgcolor: selectedProductTier
                    ? ({
                        palette: {
                          primary: { main },
                        },
                      }) => alpha(main, 0.15)
                    : undefined,
                  borderRadius: 2,
                  boxShadow: (theme) => (selectedProductTier ? theme.shadows[12] : undefined),
                  transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                }}
                onClick={noWorkspaceMethod ? () => showNoMethodModalRef.current?.(true) : () => setProductTier(curProductTier)}
              >
                <ProductTierComp productTier={curProductTier} />
              </ButtonBase>
            </Fragment>
          )
        })}
      </Stack>
      {noWorkspaceMethod ? (
        <ChangePaymentNoMethodModal
          showModalRef={showNoMethodModalRef}
          defaultOpen={tierFromSearchParams && isUpgrade !== null ? true : undefined}
        />
      ) : (
        <Stack alignItems="center" spacing={2} pt={4}>
          {noWorkspaceMethod ? null : (
            <>
              <Stack py={1} spacing={1} alignItems="center">
                {/* <Typography variant="h5" pb={1}>
              <Trans>Payment Methods</Trans>
            </Typography> */}
                {awsMarketPlacePaymentMethod ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      startIcon={<AwsLogo height={50} />}
                      endIcon={<OpenInNewIcon fontSize="small" />}
                      variant="outlined"
                      href={env.aws_marketplace_url}
                    >
                      <Typography color="#ff9900" textTransform="none">
                        {awsMarketPlacePaymentMethod ? t`Manage AWS Market place payment method` : t`Add AWS Marketplace payment method`}
                      </Typography>
                    </Button>
                  </Stack>
                ) : null}
                {stripePaymentMethod ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      startIcon={<CreditCardIcon fontSize="large" sx={{ fontSize: '48px!important' }} />}
                      sx={{
                        maxWidth: '100%',
                        width: 580,
                      }}
                      variant="outlined"
                      href={`${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}`}
                    >
                      <Typography textTransform="none">
                        <Trans>Manage card details</Trans>
                      </Typography>
                    </Button>
                  </Stack>
                ) : null}
              </Stack>
            </>
          )}
        </Stack>
      )}
      {!noWorkspaceMethod && isUpgrade !== null ? (
        <ChangePaymentMethodModal
          nextBillingCycle={nextBillingCycle}
          onClose={() => setProductTier(defaultProductTier)}
          isUpgrade={isUpgrade}
          noWorkspaceMethod={noWorkspaceMethod}
          productTier={defaultProductTier}
          selectedProductTier={productTier}
          selectedWorkspacePaymentMethod={selectedWorkspacePaymentMethod}
          showModalRef={showModalRef}
          awsPaymentMethod={awsMarketPlacePaymentMethod}
          stripePaymentMethod={stripePaymentMethod}
          defaultOpen={true}
        />
      ) : null}
      <Divider />
    </>
  )
}
