import { Trans, t } from '@lingui/macro'
import {
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { getNotificationUserQuery } from './getNotificationUser.query'
import { putNotificationUserMutation } from './putNotificationUser.mutation'

export const UserSettingsNotification = () => {
  const { currentUser } = useUserProfile()
  const { data, isLoading } = useQuery({ queryKey: ['notification-user', currentUser?.id], queryFn: getNotificationUserQuery })
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: putNotificationUserMutation,
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-user', currentUser?.id], data)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'notification-user',
      })
    },
  })
  return isLoading ? (
    <Box height={200} width="100%">
      <LoadingSuspenseFallback />
    </Box>
  ) : (
    <TableContainer component={Paper}>
      <Table aria-label={t`User Settings Notification`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Trans>Benchmark</Trans>
            </TableCell>
            <TableCell>
              <Trans>Enabled</Trans>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Trans>Weekly Report</Trans>
            </TableCell>
            <TableCell>
              {isPending ? (
                <Stack justifyContent="center" direction="column" padding={1} margin="1px">
                  <CircularProgress size={20} />
                </Stack>
              ) : (
                <Checkbox
                  checked={data?.weekly_report}
                  onChange={(e) => {
                    if (data) {
                      mutate({ inactivity_reminder: data.inactivity_reminder, weekly_report: e.target.checked })
                    }
                  }}
                />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Trans>Inactivity reminder</Trans>
            </TableCell>
            <TableCell>
              {isPending ? (
                <Stack justifyContent="center" direction="column" padding={1} margin="1px">
                  <CircularProgress size={20} />
                </Stack>
              ) : (
                <Checkbox
                  checked={data?.inactivity_reminder}
                  onChange={(e) => {
                    if (data) {
                      mutate({ weekly_report: data.weekly_report, inactivity_reminder: e.target.checked })
                    }
                  }}
                />
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
