import { Trans } from '@lingui/macro'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { ButtonBase, Divider, Stack, Typography, alpha } from '@mui/material'
import { Fragment, useRef, useState } from 'react'
import { AwsLogo } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { endPoints, env } from 'src/shared/constants'
import { LinkButton } from 'src/shared/link-button'
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
  nextBillingCycle: Date
}

const allProductTiers: readonly ProductTier[] = ['Free', 'Plus', 'Business', 'Enterprise'] as const

export const ChangeProductTier = ({
  defaultProductTier,
  selectedWorkspacePaymentMethod,
  workspacePaymentMethods,
  nextBillingCycle,
}: ChangeProductTierProps) => {
  const { selectedWorkspace, checkPermission } = useUserProfile()
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
    noWorkspaceMethod ? defaultProductTier : tierFromSearchParams ?? defaultProductTier,
  )

  const isUpgrade =
    productTier === defaultProductTier || (defaultProductTier === 'Trial' && productTier === 'Free')
      ? null
      : allProductTiers.indexOf(productTier) > allProductTiers.indexOf(defaultProductTier)

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" alignItems={{ xs: 'center', sm: 'stretch' }} justifyContent="center">
        {allProductTiers.map((curProductTier, i) => {
          const selectedProductTier = curProductTier === productTier || (productTier === 'Trial' && curProductTier === 'Free')
          return (
            <Fragment key={curProductTier}>
              {i ? <ProductTierDivider /> : null}
              {selectedProductTier || !hasPermission ? (
                <Stack
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
                    boxShadow: selectedProductTier ? 12 : undefined,
                    transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                  }}
                >
                  <ProductTierComp productTier={curProductTier} />
                </Stack>
              ) : (
                <ButtonBase
                  LinkComponent={Stack}
                  sx={{
                    alignItems: 'baseline',
                    textAlign: 'left',
                    justifyContent: 'stretch',
                    px: { xs: 2, lg: 4 },
                    py: { xs: 2, lg: 4 },
                    borderRadius: 2,
                    transition: (theme) => theme.transitions.create(['box-shadow', 'background-color']),
                  }}
                  onClick={hasPermission ? () => setProductTier(curProductTier) : undefined}
                >
                  <ProductTierComp productTier={curProductTier} />
                </ButtonBase>
              )}
            </Fragment>
          )
        })}
      </Stack>
      {hasPermission ? (
        <>
          {isUpgrade !== null ? (
            productTier === 'Free' ? (
              <ChangeProductTierToFreeModal
                onClose={() => setProductTier(defaultProductTier)}
                productTier={defaultProductTier}
                showModalRef={showModalRef}
                defaultOpen={true}
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
                productTier={defaultProductTier}
                selectedProductTier={productTier}
                selectedWorkspacePaymentMethod={selectedWorkspacePaymentMethod}
                showModalRef={showModalRef}
                defaultOpen={true}
              />
            )
          ) : (
            <Stack alignItems="center" spacing={2} pt={4}>
              {noWorkspaceMethod ? null : (
                <>
                  <Stack py={1} spacing={1} alignItems="center">
                    {awsMarketPlacePaymentMethod ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinkButton
                          startIcon={<AwsLogo height={50} />}
                          endIcon={null}
                          loadingPosition="start"
                          variant="outlined"
                          href={`${env.aws_marketplace_url}`}
                        >
                          <Typography textTransform="none">
                            <Trans>Manage AWS Market place payment method</Trans>
                          </Typography>
                        </LinkButton>
                      </Stack>
                    ) : null}
                    {stripePaymentMethod ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinkButton
                          startIcon={<CreditCardIcon fontSize="large" sx={{ fontSize: '48px!important' }} />}
                          endIcon={null}
                          loadingPosition="start"
                          sx={{
                            maxWidth: '100%',
                            width: 580,
                          }}
                          variant="outlined"
                          href={`${env.apiUrl}/${endPoints.workspaces.workspace(selectedWorkspace?.id ?? '').subscription.stripe}`}
                        >
                          <Typography textTransform="none">
                            <Trans>Manage Card Details</Trans>
                          </Typography>
                        </LinkButton>
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
  )
}
