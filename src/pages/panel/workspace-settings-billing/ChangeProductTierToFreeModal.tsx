import { Trans, plural, t } from '@lingui/macro'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import WarningIcon from '@mui/icons-material/Warning'
import { LoadingButton } from '@mui/lab'
import { Alert, Button, Link, Stack, Typography } from '@mui/material'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { getWorkspaceCloudAccountsQuery, getWorkspaceUsersQuery } from 'src/pages/panel/shared/queries'
import { Modal } from 'src/shared/modal'
import { GetWorkspaceCloudAccountsResponse, GetWorkspaceProductTier, GetWorkspaceUsersResponse } from 'src/shared/types/server'
import { ProductTier } from 'src/shared/types/server-shared'
import { putWorkspaceBillingMutation } from './putWorkspaceBilling.mutation'
import { productTierToLabel } from './utils'

export interface ChangeProductTierModalProps {
  currentProductTier: ProductTier
  showModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  defaultOpen?: boolean
  productTierData: GetWorkspaceProductTier
  onClose?: () => void
}

export const ChangeProductTierToFreeModal = ({
  showModalRef,
  defaultOpen,
  currentProductTier,
  onClose,
  productTierData,
}: ChangeProductTierModalProps) => {
  const { showSnackbar } = useSnackbar()
  const { selectedWorkspace, refreshWorkspaces } = useUserProfile()
  const [{ data: cloudAccountsLength = 0 }, { data: usersLength = 0 }] = useQueries({
    queries: [
      {
        queryFn: getWorkspaceCloudAccountsQuery,
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
        select: (data?: string | GetWorkspaceCloudAccountsResponse) =>
          typeof data === 'object' ? data.added.length + data.discovered.length + data.recent.length : 0,
      },
      {
        queryFn: getWorkspaceUsersQuery,
        queryKey: ['workspace-users', selectedWorkspace?.id],
        select: (data?: GetWorkspaceUsersResponse) => data?.length ?? 0,
      },
    ],
  })
  const hasNumberOfCloudAccountLimitation = cloudAccountsLength > (productTierData.account_limit || 0)
  const hasNumberOfUserLimitation = usersLength > (productTierData.seats_max || 0)

  const hasLimitation = hasNumberOfCloudAccountLimitation || hasNumberOfUserLimitation
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
                workspaceId: selectedWorkspace?.id ?? '',
              })
            }}
            size="large"
            sx={{ width: 180 }}
            disabled={hasLimitation}
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
          <Trans>Current Product Tier</Trans>: {productTierToLabel(currentProductTier)}
        </Typography>
        <Typography>
          <Trans>New Product Tier</Trans>: {productTierToLabel('Free')}
        </Typography>
        <Alert color="info" icon={<SentimentDissatisfiedIcon color="warning" />}>
          <Typography>
            <Trans>
              We're sad to see you downgrade, but we're grateful to still have you with us on the free tier. If there's anything specific
              you're missing, please reach out to me personally at <Link href="mailto:lars@some.engineering">lars@some.engineering</Link>.
              I'd love to hear from you and help in any way I can.
            </Trans>
          </Typography>
        </Alert>
        {hasNumberOfCloudAccountLimitation ? (
          <Alert color="warning" icon={<WarningIcon />}>
            <Typography>
              <Trans>
                You currently have{' '}
                {plural(cloudAccountsLength, {
                  one: '# cloud account',
                  other: '# cloud accounts',
                })}
                . There must only be{' '}
                {plural(productTierData.account_limit ?? 1, {
                  one: '# cloud account',
                  other: '# cloud accounts',
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
                {plural(productTierData.seats_max ?? 0, {
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
