import { Trans, t } from '@lingui/macro'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { LoadingButton } from '@mui/lab'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  rgbToHex,
  useTheme,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import QrCode from 'qrcode'
import toSJISFunc from 'qrcode/helper/to-sjis'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { FixLogoUrl } from 'src/assets/icons'
import { Spinner } from 'src/shared/loading'
import { Modal } from 'src/shared/modal'
import { GetCurrentUserResponse } from 'src/shared/types/server'
import { UserSettingsTotpRecoveryCodesModal } from './UserSettingsTotpRecoveryCodesModal'
import { UserSettingsTotpShowSecret } from './UserSettingsTotpShowSecret'
import { postAuthMfaAddMutation } from './postAuthMfaAdd.mutation'
import { postAuthMfaEnableMutation } from './postAuthMfaEnable.mutation'

interface UserSettingsTotpActivationModalProps {
  activationModalRef: MutableRefObject<((show?: boolean | undefined) => void) | undefined>
  isLoading: boolean
  email?: string
}

export const UserSettingsTotpActivationModal = ({ activationModalRef, isLoading, email }: UserSettingsTotpActivationModalProps) => {
  const modalRef = useRef<(show?: boolean | undefined) => void>()
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
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'users-me',
      })
      codesModalRef.current?.(true)
    },
  })
  const [otp, setOtp] = useState('')
  useEffect(() => {
    activationModalRef.current = (show?: boolean) => {
      if (show) {
        void addMfaMutation()
      }
      modalRef.current?.(show)
    }
    return () => {
      activationModalRef.current = () => {}
    }
  }, [activationModalRef, addMfaMutation])
  useEffect(() => {
    if (qrCodeBoxRef.current && data?.secret) {
      void QrCode.toCanvas(qrCodeBoxRef.current, `otpauth://totp/${email}?secret=${data.secret}&issuer=FIX%20Inventory`, {
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
    ? ((error as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`
    : undefined
  const addMfaErrorText = addMfaError
    ? ((addMfaError as AxiosError)?.response?.data as { detail: string })?.detail ?? t`Something went wrong please try again later.`
    : undefined
  return (
    <>
      <Modal
        openRef={modalRef}
        onSubmit={() => void mutateAsync({ otp })}
        title={<Trans>TOTP Setup</Trans>}
        actions={
          <>
            <Button variant="outlined" color="error" onClick={() => modalRef.current?.(false)}>
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
          </>
        }
      >
        {data ? (
          <Stack spacing={1}>
            <Trans>
              <Typography variant="h5">Step 1: Scan the QR Code</Typography>
              <Typography>
                First up, see this QR code on your screen? Grab your phone and open your favorite authenticator app (like Google
                Authenticator).
              </Typography>
              <Typography variant="h5">Step 2: Add a New Account</Typography>
              <Typography>
                In the app, tap on "Add" or "+" to set up a new account. Select "Scan a QR Code" and point your phone's camera at the QR
                code displayed here. This will link your account to the app.
              </Typography>
              <Button href={`otpauth://totp/${email}?secret=${data.secret}&issuer=FIX%20Inventory`} target="_blank">
                <Box ref={qrCodeBoxRef} component="canvas" />
              </Button>
              <Typography variant="h5">Step 3: Enter the Code</Typography>
              <Typography>
                Once linked, the app will display a 6-digit code. It changes every 30 seconds, so it's super fresh! Enter that code in the
                box below and hit "Activate". And voilà, you're all set!
              </Typography>
            </Trans>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="manual-setup-content" id="manual-setup-header">
                <Typography variant="h5">
                  <Trans>Add Manually</Trans>
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
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
                    <UserSettingsTotpShowSecret secret={data.secret} />
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
              </AccordionDetails>
            </Accordion>
            <TextField
              size="small"
              error={!!error}
              helperText={formError}
              placeholder="123456"
              FormHelperTextProps={{ sx: { m: 0, mt: 1 } }}
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
                  void mutateAsync({ otp: value })
                }
              }}
            />
          </Stack>
        ) : addMfaErrorText ? (
          <Typography color="error.main">{addMfaErrorText}</Typography>
        ) : (
          <Stack height={150} width="100%" alignItems="center" justifyContent="center">
            <Spinner isLoading />
          </Stack>
        )}
      </Modal>
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
