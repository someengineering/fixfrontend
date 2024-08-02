import { Trans } from '@lingui/macro'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { Box, ButtonBase, Divider, Stack, Typography, alpha } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Fragment, useRef, useState } from 'react'
import { AwsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceProductTiersQuery } from 'src/pages/panel/shared/queries'
import { endPoints, env } from 'src/shared/constants'
import { ExternalLinkLoadingButton } from 'src/shared/link-button'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { PaymentMethod, ProductTier } from 'src/shared/types/server-shared'
import { ChangePaymentNoMethodModal } from './ChangePaymentNoMethodModal'
import { ChangeProductTierModal } from './ChangeProductTierModal'
import { ChangeProductTierToFreeModal } from './ChangeProductTierToFreeModal'
import { ProductTierComp } from './ProductTierComp'
import { ProductTierDivider } from './ProductTierDivider'
import { useGetProductTierFromSearchParams } from './utils'

interface ChangeProductTierProps {
  selectedWorkspacePaymentMethod: PaymentMethod
  workspacePaymentMethods: PaymentMethod[]
  defaultProductTier: ProductTier
  currentProductTier: ProductTier
  nextBillingCycle: Date
}

const allProductTiers: readonly ProductTier[] = ['Free', 'Business'] as const

export const ChangeProductTier = ({
  defaultProductTier,
  currentProductTier,
  selectedWorkspacePaymentMethod,
  workspacePaymentMethods,
  nextBillingCycle,
}: ChangeProductTierProps) => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const { data } = useQuery({
    queryFn: getWorkspaceProductTiersQuery,
    queryKey: ['workspace-product-tiers', selectedWorkspace?.id],
  })
  const hasPermission = checkPermission('updateBilling')
  const tierFromSearchParams = useGetProductTierFromSearchParams()
  const showModalRef = useRef<(show?: boolean | undefined) => void>()
  const showNoMethodModalRef = useRef<(show?: boolean | undefined) => void>()

  const [awsMarketPlacePaymentMethod, stripePaymentMethod] = [
    selectedWorkspacePaymentMethod.method === 'aws_marketplace' ? selectedWorkspacePaymentMethod : undefined,
    selectedWorkspacePaymentMethod.method === 'stripe' ? selectedWorkspacePaymentMethod : undefined,
  ]

  const noWorkspaceMethod = selectedWorkspacePaymentMethod.method === 'none'

  const [productTier, setProductTier] = useState<ProductTier>(() =>
    noWorkspaceMethod ? defaultProductTier : (tierFromSearchParams ?? defaultProductTier),
  )

  const isUpgrade =
    productTier === defaultProductTier || (defaultProductTier === 'Trial' && productTier === 'Free')
      ? null
      : allProductTiers.indexOf(productTier) > allProductTiers.indexOf(defaultProductTier)

  return data ? (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        flexWrap="wrap"
        alignItems={{ xs: 'center', md: 'stretch' }}
        gap={{ xs: 0, md: 5, xl: 15 }}
        justifyContent="center"
      >
        {allProductTiers.map((curProductTier, i) => {
          const selectedProductTier = curProductTier === productTier || (productTier === 'Trial' && curProductTier === 'Free')
          return data[curProductTier] ? (
            <Fragment key={curProductTier}>
              {i ? <ProductTierDivider /> : null}
              {selectedProductTier || !hasPermission ? (
                <Stack
                  sx={{
                    width: 350,
                    maxWidth: '100%',
                    alignItems: 'baseline',
                    textAlign: 'left',
                    justifyContent: 'stretch',
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 4 },
                    bgcolor: selectedProductTier
                      ? ({
                          palette: {
                            primary: { main },
                          },
                        }) => alpha(main, 0.15)
                      : undefined,
                    borderRadius: 2,
                    boxShadow: selectedProductTier ? 12 : undefined,
                    transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                  }}
                >
                  <ProductTierComp productTier={curProductTier} productTierData={data[curProductTier]} />
                </Stack>
              ) : (
                <ButtonBase
                  LinkComponent={Stack}
                  sx={{
                    width: 350,
                    maxWidth: '100%',
                    alignItems: 'baseline',
                    textAlign: 'left',
                    justifyContent: 'stretch',
                    px: { xs: 2, md: 4 },
                    py: { xs: 2, md: 4 },
                    borderRadius: 2,
                    transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                  }}
                  onClick={hasPermission ? () => setProductTier(curProductTier) : undefined}
                >
                  <ProductTierComp productTier={curProductTier} productTierData={data[curProductTier]} />
                </ButtonBase>
              )}
            </Fragment>
          ) : null
        })}
      </Stack>
      {hasPermission ? (
        <>
          {isUpgrade !== null ? (
            productTier === 'Free' ? (
              <ChangeProductTierToFreeModal
                onClose={() => setProductTier(defaultProductTier)}
                currentProductTier={currentProductTier}
                showModalRef={showModalRef}
                defaultOpen={true}
                productTierData={
                  data.Free ?? {
                    account_limit: 0,
                    accounts_included: 0,
                    price_per_account_cents: 0,
                    // retention_period: 'P0s',
                    scan_interval: 'P0s',
                    // seats_included: 0,
                    seats_max: 0,
                  }
                }
              />
            ) : noWorkspaceMethod ? (
              <ChangePaymentNoMethodModal
                selectedProductTier={productTier}
                showModalRef={showNoMethodModalRef}
                defaultOpen={true}
                onClose={() => setProductTier(defaultProductTier)}
              />
            ) : (
              <ChangeProductTierModal
                workspacePaymentMethods={workspacePaymentMethods}
                nextBillingCycle={nextBillingCycle}
                onClose={() => setProductTier(defaultProductTier)}
                isUpgrade={isUpgrade}
                selectedProductTier={productTier}
                currentProductTier={currentProductTier}
                selectedWorkspacePaymentMethod={selectedWorkspacePaymentMethod}
                showModalRef={showModalRef}
                defaultOpen={true}
                productTierData={
                  data[productTier] ?? {
                    account_limit: 0,
                    accounts_included: 0,
                    price_per_account_cents: 0,
                    // retention_period: 'P0s',
                    scan_interval: 'P0s',
                    // seats_included: 0,
                    seats_max: 0,
                  }
                }
              />
            )
          ) : (
            <Stack alignItems="center" spacing={2} pt={4}>
              {noWorkspaceMethod ? null : (
                <>
                  <Stack py={1} spacing={1} alignItems="center" width="100%">
                    {awsMarketPlacePaymentMethod ? (
                      <Stack spacing={1} alignItems="center" width="100%">
                        <ExternalLinkLoadingButton
                          startIcon={
                            <Box py={1} height={48}>
                              <AwsLogo height="100%" />
                            </Box>
                          }
                          endIcon={null}
                          loadingPosition="start"
                          variant="outlined"
                          href={`${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').awsMarketplaceProduct}`}
                        >
                          <Typography textTransform="none">
                            <Trans>Manage AWS Market place payment method</Trans>
                          </Typography>
                        </ExternalLinkLoadingButton>
                      </Stack>
                    ) : null}
                    {stripePaymentMethod ? (
                      <Stack spacing={1} alignItems="center" width="100%">
                        <ExternalLinkLoadingButton
                          startIcon={<CreditCardIcon fontSize="large" sx={{ fontSize: '48px!important' }} />}
                          endIcon={null}
                          loadingPosition="start"
                          sx={{
                            maxWidth: '100%',
                            width: { xs: '100%', sm: 350, md: 580 },
                          }}
                          variant="outlined"
                          href={`${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}`}
                        >
                          <Typography textTransform="none">
                            <Trans>Manage Card Details</Trans>
                          </Typography>
                        </ExternalLinkLoadingButton>
                      </Stack>
                    ) : null}
                  </Stack>
                </>
              )}
            </Stack>
          )}
        </>
      ) : null}
      <Divider />
    </>
  ) : (
    <LoadingSuspenseFallback />
  )
}
