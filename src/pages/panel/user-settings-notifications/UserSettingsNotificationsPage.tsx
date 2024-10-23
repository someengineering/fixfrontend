import { Trans } from '@lingui/macro'
import { CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { IOSSwitch } from 'src/shared/switch'
import { getNotificationUserQuery } from './getNotificationUser.query'
import { putNotificationUserMutation } from './putNotificationUser.mutation'

export default function UserSettingsNotificationsPage() {
  const { currentUser } = useUserProfile()
  const { data } = useSuspenseQuery({ queryKey: ['notification-user', currentUser?.id], queryFn: getNotificationUserQuery })
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: putNotificationUserMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-user', currentUser?.id], data)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'notification-user',
      })
    },
  })
  return (
    <Stack spacing={3}>
      <Typography variant="h6">
        <Trans>Benchmarks</Trans>
      </Typography>
      <FormControlLabel
        control={
          isPending ? (
            <Stack justifyContent="center" alignItems="center" width={44} height={24} mr={2}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <IOSSwitch checked={data?.weekly_report} onChange={(e) => mutate({ ...data, weekly_report: e.target.checked })} />
          )
        }
        label={
          <Typography variant="subtitle1">
            <Trans>Weekly report</Trans>
          </Typography>
        }
      />
      <FormControlLabel
        control={
          isPending ? (
            <Stack justifyContent="center" alignItems="center" width={44} height={24} mr={2}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <IOSSwitch checked={data?.inactivity_reminder} onChange={(e) => mutate({ ...data, inactivity_reminder: e.target.checked })} />
          )
        }
        label={
          <Typography variant="subtitle1">
            <Trans>Inactivity reminder</Trans>
          </Typography>
        }
      />
      <FormControlLabel
        control={
          isPending ? (
            <Stack justifyContent="center" alignItems="center" width={44} height={24} mr={2}>
              <CircularProgress size={24} />
            </Stack>
          ) : (
            <IOSSwitch checked={data?.marketing} onChange={(e) => mutate({ ...data, marketing: e.target.checked })} />
          )
        }
        label={
          <Typography variant="subtitle1">
            <Trans>Marketing</Trans>
          </Typography>
        }
      />
    </Stack>
  )
}
