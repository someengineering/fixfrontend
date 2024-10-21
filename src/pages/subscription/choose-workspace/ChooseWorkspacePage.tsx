import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Button, Card, CardHeader, Grid, Stack, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { useSnackbar } from 'src/core/snackbar'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { setSubscriptionId } from 'src/shared/utils/localstorage'
import { putWorkspaceSubscriptionMutation } from './putWorkspaceSubscription.mutation'

export default function ChooseWorkspacePage() {
  const { workspaces, selectedWorkspace, selectWorkspace } = useUserProfile()
  const { showSnackbar } = useSnackbar()
  const navigate = useAbsoluteNavigate()

  const afterSubmit = useCallback(() => {
    setSubscriptionId()
    navigate('/settings/workspace/billing-receipts')
  }, [navigate])

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: putWorkspaceSubscriptionMutation,
    onSuccess: () => {
      afterSubmit()
      showSnackbar(t`Subscription successfully added to ${selectedWorkspace?.name}`, {
        alertColor: 'success',
        snackbarProps: { sx: { zIndex: ({ zIndex: { tooltip } }) => tooltip + 4 } },
      })
    },
    onError: (err) => {
      const { response, message } = err as AxiosError
      showSnackbar(
        response?.data && typeof response.data === 'object' && 'message' in response.data && typeof response.data.message === 'string'
          ? response.data.message
          : typeof response?.data === 'string'
            ? response.data
            : message,
        { alertColor: 'error', snackbarProps: { sx: { zIndex: ({ zIndex: { tooltip } }) => tooltip + 4 } } },
      )
    },
  })
  const [getSearch] = useSearchParams()
  const subscriptionId = getSearch.get('subscription_id')

  useEffect(() => {
    if (subscriptionId) {
      if (workspaces?.length === 1) {
        mutateAsync({ workspaceId: workspaces[0].id ?? '', subscriptionId: subscriptionId ?? '' })
      }
      setSubscriptionId(subscriptionId)
    } else {
      navigate(panelUI.homePage)
    }
  }, [subscriptionId, navigate, workspaces, mutateAsync])

  const handleSubmit = async (id: string) => {
    await selectWorkspace(id)
    window.setTimeout(() => {
      mutateAsync({ workspaceId: selectedWorkspace?.id ?? '', subscriptionId: subscriptionId ?? '' })
    })
  }
  const handleCancel = () => {
    setSubscriptionId()
    navigate('/settings/workspace/billing-receipts')
  }

  return (subscriptionId && workspaces?.length && workspaces.length > 1) || error ? (
    <>
      <Typography variant="h3" color="primary.main" textAlign="center" mb={2}>
        <Trans>Congratulations on your subscription</Trans>
        🎉🎊😍
      </Typography>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="h5" textAlign="left" mb={4} maxWidth={550}>
          <Trans>Please select the workspace where you would like to activate this subscription.</Trans>
        </Typography>
      </Stack>
      <Grid container spacing={2} width="100%" justifyContent="center" mb={2}>
        {workspaces?.map((item) => (
          <Grid item key={item.id}>
            <LoadingButton
              onClick={() => {
                handleSubmit(item.id)
              }}
              disabled={isPending}
              loading={item.id === selectedWorkspace?.id && isPending}
              sx={{ p: 0 }}
            >
              <Card sx={item.id === selectedWorkspace?.id && isPending ? { bgcolor: 'primary.dark', color: 'white' } : undefined}>
                <CardHeader
                  title={item.name}
                  titleTypographyProps={{
                    sx: {
                      opacity: item.id === selectedWorkspace?.id && isPending ? 0 : 1,
                      transition: ({ transitions }) => transitions.create('opacity'),
                    },
                  }}
                  subheader={item.slug}
                  subheaderTypographyProps={{
                    sx: {
                      opacity: item.id === selectedWorkspace?.id && isPending ? 0 : 1,
                      transition: ({ transitions }) => transitions.create('opacity'),
                    },
                  }}
                />
              </Card>
            </LoadingButton>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button variant="outlined" color="error" onClick={handleCancel} sx={{ minHeight: 50 }}>
          <Trans>Cancel</Trans>
        </Button>
      </Stack>
    </>
  ) : (
    <LoadingSuspenseFallback />
  )
}
