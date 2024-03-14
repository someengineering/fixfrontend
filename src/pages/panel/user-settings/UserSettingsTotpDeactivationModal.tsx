import { Trans, t } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject, useState } from 'react'
import { useSnackbar } from 'src/core/snackbar'
import { Modal } from 'src/shared/modal'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { postAuthMfaDisableMutation } from './postAuthMfaDisable.mutation'

interface UserSettingsTotpDeactivationModalProps {
  deactivationModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isLoading: boolean
}

export const UserSettingsTotpDeactivationModal = ({ deactivationModalRef, isLoading }: UserSettingsTotpDeactivationModalProps) => {
  const queryClient = useQueryClient()
  const showSnackbar = useSnackbar()
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: postAuthMfaDisableMutation,
    onSuccess: () => {
      queryClient.setQueryData(['users-me'], (oldData: GetCurrentUserResponse) => {
        const newData = { ...oldData }
        newData.is_mfa_active = false
        return newData
      })
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'users-me',
      })
      void showSnackbar.showSnackbar(t`TOTP disabled successfully`, { autoHideDuration: null })
      deactivationModalRef.current?.(false)
    },
  })
  const [otp, setOtp] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const buttonDisabled = (!otp || otp.length !== 6) && !recoveryCode
  const formError = error
    ? ((error as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`
    : undefined
  return (
    <Modal
      openRef={deactivationModalRef}
      onSubmit={() => void mutateAsync(otp ? { otp } : { recoveryCode })}
      title={<Trans>TOTP Deactivation</Trans>}
      actions={
        <>
          <Button variant="outlined" color="error" onClick={() => deactivationModalRef.current?.(false)}>
            <Trans>Cancel</Trans>
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isPending} disabled={isLoading || isPending || buttonDisabled}>
            <Trans>Deactivate</Trans>
          </LoadingButton>
        </>
      }
    >
      <Stack spacing={1}>
        <Typography variant="h6">
          <Trans>You can deactivate TOTP via otp code</Trans>
        </Typography>
        <TextField
          size="small"
          error={!!error}
          helperText={formError}
          placeholder="123456"
          FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
          value={otp}
          id="otp"
          fullWidth
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          label={t`OTP Code`}
          variant="outlined"
          type="text"
          disabled={isPending}
          onChange={(e) => {
            const value = e.target.value ?? ''
            setOtp(value)
            if (value.length === 6) {
              void mutateAsync({ otp: value })
            }
          }}
        />
        <Divider>
          <Typography variant="h5">
            <Trans>Or</Trans>
          </Typography>
        </Divider>
        <Typography variant="h6">
          <Trans>You can deactivate TOTP via recovery code</Trans>
        </Typography>
        <TextField
          size="small"
          error={!!error}
          helperText={formError}
          placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
          value={recoveryCode}
          required
          id="recovery_code"
          fullWidth
          name="recovery_code"
          autoComplete="one-time-code"
          label={t`Recovery Code`}
          variant="outlined"
          type="text"
          disabled={isPending}
          onChange={(e) => setRecoveryCode(e.target.value ?? '')}
        />
      </Stack>
    </Modal>
  )
}
