import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { alpha, ButtonBase, Card, CardHeader, Grid, Stack, styled, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { setSubscriptionId } from 'src/shared/utils/localstorage'
import { putWorkspaceSubscriptionMutation } from './putWorkspaceSubscription.mutation'

const ChooseWorkspaceButton = styled(LoadingButton)({
  minHeight: 50,
})

export default function ChooseWorkspacePage() {
  const { workspaces, selectedWorkspace, selectWorkspace } = useUserProfile()
  const { showSnackbar } = useSnackbar()
  const navigate = useAbsoluteNavigate()

  const afterSubmit = useCallback(() => {
    setSubscriptionId()
    navigate('/workspace-settings/billing-receipts')
  }, [navigate])

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: putWorkspaceSubscriptionMutation,
    onSuccess: () => {
      afterSubmit()
      void showSnackbar(t`Subscription successfully added to ${selectedWorkspace?.name}`, {
        severity: 'success',
        snackbarProps: { sx: { zIndex: ({ zIndex: { tooltip } }) => tooltip + 4 } },
      })
    },
    onError: (err) => {
      const { response, message } = err as AxiosError
      void showSnackbar(
        response?.data && typeof response.data === 'object' && 'message' in response.data && typeof response.data.message === 'string'
          ? response.data.message
          : typeof response?.data === 'string'
            ? response.data
            : message,
        { severity: 'error', snackbarProps: { sx: { zIndex: ({ zIndex: { tooltip } }) => tooltip + 4 } } },
      )
    },
  })
  const [getSearch] = useSearchParams()
  const subscriptionId = getSearch.get('subscription_id')

  useEffect(() => {
    if (subscriptionId) {
      if (workspaces?.length === 1) {
        void mutateAsync({ workspaceId: workspaces[0].id ?? '', subscriptionId: subscriptionId ?? '' })
      }
      setSubscriptionId(subscriptionId)
    } else {
      navigate('/')
    }
  }, [subscriptionId, navigate, workspaces, mutateAsync])

  const handleSubmit = () => {
    void mutateAsync({ workspaceId: selectedWorkspace?.id ?? '', subscriptionId: subscriptionId ?? '' })
  }
  const handleCancel = () => {
    setSubscriptionId()
    navigate('/workspace-settings/billing-receipts')
  }

  return (subscriptionId && workspaces?.length && workspaces.length > 1) || error ? (
    <>
      <Typography variant="h3" color="primary.main" textAlign="center" mb={2}>
        <Trans>Congratulations on your subscription</Trans>
        🎉🎊😍
      </Typography>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="h5" textAlign="left" mb={4} maxWidth={550}>
          <Trans>We appreciate your decision to subscribe to our service through AWS Marketplace.</Trans>
        </Typography>
        <Typography variant="h6" textAlign="left" mb={4} maxWidth={550}>
          <Trans>To enhance your experience, please select the workspace where you'd like to activate your subscription</Trans>:
        </Typography>
      </Stack>
      <Grid container spacing={2} width="100%" justifyContent="center" mb={2}>
        {workspaces?.map((item) => (
          <Grid item key={item.id}>
            <ButtonBase
              onClick={() => {
                void selectWorkspace(item.id)
              }}
            >
              <Card sx={item.id === selectedWorkspace?.id ? { bgcolor: 'primary.dark', color: 'white' } : undefined}>
                <CardHeader
                  title={item.name}
                  subheader={item.slug}
                  subheaderTypographyProps={item.id === selectedWorkspace?.id ? { color: alpha('#ffffff', 0.6) } : undefined}
                />
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={1} justifyContent="center">
        <ChooseWorkspaceButton variant="outlined" color="error" onClick={handleCancel}>
          <Trans>Cancel</Trans>
        </ChooseWorkspaceButton>
        <ChooseWorkspaceButton variant="contained" onClick={handleSubmit} loading={isPending}>
          <Trans>Choose Workspace</Trans>
        </ChooseWorkspaceButton>
      </Stack>
    </>
  ) : (
    <LoadingSuspenseFallback />
  )
}
