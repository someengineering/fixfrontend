import { Trans, t } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, Stack, TextField, Typography, rgbToHex, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import QrCode from 'qrcode'
import toSJISFunc from 'qrcode/helper/to-sjis'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { FixLogoUrl } from 'src/assets/icons'
import { Spinner } from 'src/shared/loading'
import { RightSlider } from 'src/shared/right-slider'
import { SecretField } from 'src/shared/secret-field'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { UserSettingsTotpRecoveryCodesModal } from './UserSettingsTotpRecoveryCodesModal'
import { postAuthMfaAddMutation } from './postAuthMfaAdd.mutation'
import { postAuthMfaEnableMutation } from './postAuthMfaEnable.mutation'

interface UserSettingsTotpActivationModalProps {
  activationModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isLoading: boolean
  email?: string
}

export const UserSettingsTotpActivationModal = ({ activationModalRef, isLoading, email }: UserSettingsTotpActivationModalProps) => {
  const [open, setOpen] = useState(false)
  const codesModalRef = useRef<(show?: boolean | undefined) => void>()
  const qrCodeBoxRef = useRef<HTMLCanvasElement>()
  const {
    mutateAsync: addMfaMutation,
    isPending: addMfaPending,
    data,
    error: addMfaError,
  } = useMutation({ mutationFn: postAuthMfaAddMutation })
  const {
    palette: {
      primary: { dark: primaryDarkColor },
    },
  } = useTheme()
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: postAuthMfaEnableMutation,
    onSuccess: () => {
      queryClient.setQueryData(['users-me'], (oldData: GetCurrentUserResponse) => {
        const newData = { ...oldData }
        newData.is_mfa_active = true
        return newData
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'users-me',
      })
      codesModalRef.current?.(true)
    },
  })
  const [otp, setOtp] = useState('')
  useEffect(() => {
    activationModalRef.current = (show?: boolean) => {
      if (show) {
        addMfaMutation()
      }
      setOpen(show ?? false)
    }
    return () => {
      activationModalRef.current = () => {}
    }
  }, [activationModalRef, addMfaMutation])
  useEffect(() => {
    if (qrCodeBoxRef.current && data?.secret) {
      QrCode.toCanvas(qrCodeBoxRef.current, `otpauth://totp/${email}?secret=${data.secret}&issuer=FIX%20Inventory`, {
        color: { dark: rgbToHex(primaryDarkColor), light: '#fff' },
        toSJISFunc,
      }).then(() => {
        const img = new Image()
        img.src = FixLogoUrl

        const ctx = qrCodeBoxRef.current?.getContext('2d')
        const width = qrCodeBoxRef.current?.width ?? 0
        window.setTimeout(() => {
          const canvas_Centre_Horizontal = width / 2
          const canvas_Centre_Vertical = width / 2

          const logoSize_Horizontal = width * 0.16
          const logoSize_Vertical = width * 0.16

          const imageStart_Horizontal = canvas_Centre_Horizontal - logoSize_Horizontal / 2
          const imageStart_Vertical = canvas_Centre_Vertical - logoSize_Vertical / 2

          ctx?.drawImage(img, imageStart_Horizontal, imageStart_Vertical, logoSize_Horizontal, logoSize_Vertical)
        }, 50)
      })
    }
  }, [data?.secret, email, primaryDarkColor])
  const buttonDisabled = !otp || otp.length !== 6
  const formError = error
    ? (((error as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`)
    : undefined
  const addMfaErrorText = addMfaError
    ? (((addMfaError as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`)
    : undefined
  return (
    <>
      <RightSlider
        open={open}
        component="form"
        onClose={() => setOpen(false)}
        onSubmit={(e) => {
          e.preventDefault()
          mutateAsync({ otp })
        }}
        title={
          <Typography variant="h4">
            <Trans>TOTP Setup</Trans>
          </Typography>
        }
        spacing={3}
      >
        {data ? (
          <>
            <Stack spacing={3} p={3}>
              <Trans>
                <Stack spacing={1}>
                  <Typography variant="h6">Step 1: Scan the QR Code</Typography>
                  <Typography variant="subtitle1">
                    First up, see this QR code on your screen? Grab your phone and open your favorite authenticator app (like Google
                    Authenticator).
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="h6">Step 2: Add a New Account</Typography>
                  <Typography variant="subtitle1">
                    In the app, tap on "Add" or "+" to set up a new account. Select "Scan a QR Code" and point your phone's camera at the QR
                    code displayed here. This will link your account to the app.
                  </Typography>
                </Stack>
                <Button href={`otpauth://totp/${email}?secret=${data.secret}&issuer=FIX%20Inventory`} target="_blank">
                  <Box ref={qrCodeBoxRef} component="canvas" />
                </Button>
                <Stack spacing={1}>
                  <Typography variant="h6">Step 3: Enter the Code</Typography>
                  <Typography variant="subtitle1">
                    Once linked, the app will display a 6-digit code. It changes every 30 seconds, so it's super fresh! Enter that code in
                    the box below and hit "Activate". And voilà, you're all set!
                  </Typography>
                </Stack>
              </Trans>
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h4">Add manually</Typography>
                <Typography component={Stack} spacing={1}>
                  <Trans>
                    <Typography variant="h5" component="span">
                      Open Your Authenticator App:
                    </Typography>{' '}
                    Head over to your authenticator app and choose to add a new account manually.
                    <Typography variant="h5" component="span">
                      Enter Account Details:
                    </Typography>{' '}
                    You'll need to type in your account's email address or username, and the key provided below.
                    <Typography variant="h5" component="span">
                      Your Key:
                    </Typography>{' '}
                    <SecretField
                      secret={data.secret}
                      numberOfCharacter={32}
                      slotProps={{
                        typographyContainerBox: {
                          ml: { xs: 0, md: 2 },
                          mb: { xs: 1, md: 0 },
                          height: 44,
                        },
                        copyButton: {
                          sx: {
                            height: 44,
                          },
                        },
                      }}
                    />
                    <Typography variant="h5" component="span">
                      Verification Type:
                    </Typography>{' '}
                    Make sure to select "Time-based" as the verification type.
                    <Typography variant="h5" component="span">
                      Enter the Code:
                    </Typography>{' '}
                    Once your account is added manually, the app will show a 6-digit code. Pop that code into the box below and hit
                    "Activate".
                  </Trans>
                </Typography>
                <TextField
                  size="small"
                  error={!!error}
                  helperText={formError}
                  placeholder="123456"
                  value={otp}
                  required
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
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" pb={3} px={3} spacing={2} justifyContent="end">
              <Button variant="outlined" onClick={() => setOpen(false)}>
                <Trans>Cancel</Trans>
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isPending || addMfaPending}
                disabled={isLoading || isPending || addMfaPending || buttonDisabled}
              >
                <Trans>Activate</Trans>
              </LoadingButton>
            </Stack>
          </>
        ) : addMfaErrorText ? (
          <Typography color="error.main">{addMfaErrorText}</Typography>
        ) : (
          <Stack height={150} width="100%" alignItems="center" justifyContent="center">
            <Spinner isLoading />
          </Stack>
        )}
      </RightSlider>
      <UserSettingsTotpRecoveryCodesModal
        recoveryCodes={data?.recovery_codes ?? []}
        recoveryCodesModalRef={codesModalRef}
        onClose={() => {
          activationModalRef.current?.(false)
        }}
      />
    </>
  )
}
