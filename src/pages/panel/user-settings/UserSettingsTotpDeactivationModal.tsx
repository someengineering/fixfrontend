import { Trans, t } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { MutableRefObject, useEffect, useState } from 'react'
import { useSnackbar } from 'src/core/snackbar'
import { RightSlider } from 'src/shared/right-slider'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { postAuthMfaDisableMutation } from './postAuthMfaDisable.mutation'

interface UserSettingsTotpDeactivationModalProps {
  deactivationModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isLoading: boolean
}

export const UserSettingsTotpDeactivationModal = ({ deactivationModalRef, isLoading }: UserSettingsTotpDeactivationModalProps) => {
  const [open, setOpen] = useState(false)
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
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'users-me',
      })
      showSnackbar.showSnackbar(t`TOTP disabled successfully`, { autoHideDuration: null })
      setOpen(true)
    },
  })
  useEffect(() => {
    deactivationModalRef.current = (show?: boolean) => {
      setOpen(show ?? false)
    }
    return () => {
      deactivationModalRef.current = () => {}
    }
  }, [deactivationModalRef])
  const [otp, setOtp] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const buttonDisabled = (!otp || otp.length !== 6) && !recoveryCode
  const formError = error
    ? (((error as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`)
    : undefined
  return (
    <RightSlider
      open={open}
      component="form"
      onClose={() => setOpen(false)}
      onSubmit={(e) => {
        e.preventDefault()
        mutateAsync(otp ? { otp } : { recoveryCode })
      }}
      title={
        <Typography variant="h4">
          <Trans>TOTP Deactivation</Trans>
        </Typography>
      }
      spacing={3}
    >
      <Stack spacing={3} p={3}>
        <Typography variant="h6">
          <Trans>You can deactivate TOTP via otp code</Trans>
        </Typography>
        <TextField
          size="small"
          error={!!error}
          helperText={formError}
          placeholder="123456"
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
              mutateAsync({ otp: value })
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
      <Divider />
      <Stack direction="row" pb={3} px={3} spacing={2} justifyContent="end">
        <Button variant="outlined" color="error" onClick={() => deactivationModalRef.current?.(false)}>
          <Trans>Cancel</Trans>
        </Button>
        <LoadingButton type="submit" variant="contained" loading={isPending} disabled={isLoading || isPending || buttonDisabled}>
          <Trans>Deactivate</Trans>
        </LoadingButton>
      </Stack>
    </RightSlider>
  )
}
