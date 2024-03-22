import { Trans, t } from '@lingui/macro'
import DoneIcon from '@mui/icons-material/Done'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Divider,
  Link,
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
import { Fragment, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { env } from 'src/shared/constants'
import { Modal } from 'src/shared/modal'
import { PaymentMethod, ProductTier } from 'src/shared/types/server'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { productTierToDescription, productTierToLabel } from './utils'

interface ChangePaymentMethodProps {
  workspacePaymentMethod: PaymentMethod
  defaultProductTier: ProductTier
}

const allProductTiers: ProductTier[] = ['Free', 'Plus', 'Business', 'Enterprise']

const ProductTierComp = ({ productTier }: { productTier: ProductTier }) => {
  const label = productTierToLabel(productTier)
  const desc = productTierToDescription(productTier)
  if (!desc) {
    return null
  }
  const priceDesc = desc.monthly ? t`per cloud account, per month` : ''
  return (
    <Stack spacing={4} width={216}>
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
        <Typography variant="h2" fontWeight={700}>
          ${desc.price.toString()}
        </Typography>
        {priceDesc ? (
          <Typography variant="body2" fontWeight={600}>
            {priceDesc}
          </Typography>
        ) : null}
        <Typography variant="subtitle1" fontSize={14} fontWeight={400}>
          (
          {desc.cloudAccounts.maximum
            ? t`maximum of ${desc.cloudAccounts.maximum} cloud accounts`
            : t`minimum of ${desc.cloudAccounts.minimum} cloud accounts`}
          )
        </Typography>
        {!priceDesc ? <Box height={16.09} /> : null}
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

export const ChangePaymentMethod = ({ defaultProductTier, workspacePaymentMethod }: ChangePaymentMethodProps) => {
  const { selectedWorkspace } = useUserProfile()
  const [search] = useSearchParams()
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [productTier, setProductTier] = useState<ProductTier>(() => (search.get('tier') as ProductTier) ?? defaultProductTier)

  const { mutate: changeBilling, isPending: changeBillingIsPending } = useMutation({
    mutationFn: putWorkspaceBillingMutation,
    onSuccess: () => {
      void showSnackbar(t`Product tier changed to ${productTier}`, { severity: 'success' })
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

  const isUpgrade =
    productTier === defaultProductTier || (defaultProductTier === 'Trial' && productTier === 'Free')
      ? null
      : allProductTiers.indexOf(productTier) > allProductTiers.indexOf(defaultProductTier)

  const noWorkspaceMethod = workspacePaymentMethod.method === 'none'

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
                onClick={() => setProductTier(curProductTier)}
              >
                <ProductTierComp productTier={curProductTier} />
              </ButtonBase>
            </Fragment>
          )
        })}
      </Stack>
      <Stack alignItems="center" spacing={5} pt={4}>
        <Button
          color={isUpgrade === null ? undefined : isUpgrade ? 'success' : 'error'}
          variant="contained"
          disabled={isUpgrade === null}
          onClick={() => showModalRef.current?.(true)}
          endIcon={isUpgrade === null ? undefined : isUpgrade ? <UpgradeIcon /> : <TrendingDownIcon />}
        >
          {isUpgrade === null ? <Trans>Change Product Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
        </Button>
        <Typography maxWidth={587} textAlign="center">
          *{' '}
          <Trans>
            Our fair-use policy allows for up to 200,000 resources per account. If your needs surpass this amount, please{' '}
            <Link href="mailto:hi@fix.tt">reach out</Link> to discuss your specific requirements.
          </Trans>
        </Typography>
      </Stack>
      <Modal
        defaultOpen={search.get('tier') ? true : undefined}
        openRef={showModalRef}
        actions={
          <>
            <Button
              href={env.aws_marketplace_url}
              disabled={!env.aws_marketplace_url}
              variant="outlined"
              color="success"
              endIcon={<OpenInNewIcon />}
            >
              <Trans>To AWS Marketplace</Trans>
            </Button>
            {!noWorkspaceMethod ? (
              <LoadingButton
                loadingPosition="end"
                loading={changeBillingIsPending}
                color={isUpgrade ? 'success' : 'error'}
                variant="contained"
                onClick={() => {
                  changeBilling({
                    product_tier: productTier,
                    workspaceId: selectedWorkspace?.id ?? '',
                  })
                }}
                endIcon={isUpgrade ? <UpgradeIcon /> : <TrendingDownIcon />}
              >
                {isUpgrade === null ? <Trans>Change Product Tier</Trans> : isUpgrade ? <Trans>Upgrade</Trans> : <Trans>Downgrade</Trans>}
              </LoadingButton>
            ) : null}
          </>
        }
        title={noWorkspaceMethod ? t`Payment Method Required` : t`Change payment method`}
        description={
          noWorkspaceMethod ? null : (
            <Trans>You are about to apply changes to your billing information. Please review the new details below:</Trans>
          )
        }
      >
        {noWorkspaceMethod ? (
          <>
            <Typography>
              <Trans>You need an AWS Marketplace Subscription to upgrade your plan.</Trans>
            </Typography>
            <Alert color="warning">Make sure to log in to AWS Console before proceeding.</Alert>
          </>
        ) : (
          <Stack spacing={1}>
            <Typography>
              <Trans>Product Tier</Trans>: {productTierToLabel(productTier)}
            </Typography>
          </Stack>
        )}
      </Modal>
      <Divider />
    </>
  )
}
