import { t, Trans } from '@lingui/macro'
import { LoadingButton } from '@mui/lab'
import { alpha, Box, Button, Divider, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, MouseEvent as ReactMouseEvent, useRef, useState } from 'react'
import { AddIcon } from 'src/assets/icons'
import { useThemeMode } from 'src/core/theme'
import { Modal } from 'src/shared/modal'
import { RightSlider } from 'src/shared/right-slider'
import { SecretField } from 'src/shared/secret-field'
import { ApiTokenItem, PostApiTokenErrorResponse } from 'src/shared/types/server'
import { postApiTokenMutation } from './postApiToken.mutation'

interface UserSettingsApiTokensAddTokenProps {
  forbiddenNames: string[]
  onClose?: () => void
}

export const UserSettingsApiTokensAddToken = ({ forbiddenNames, onClose }: UserSettingsApiTokensAddTokenProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [open, setOpen] = useState(false)
  const successModalRef = useRef<((show?: boolean) => void) | undefined>()
  const [description, setDescription] = useState('')
  const { mode } = useThemeMode()
  const queryClient = useQueryClient()
  const { mutate, isPending, data, isSuccess, error, reset } = useMutation({
    mutationFn: postApiTokenMutation,
    onSuccess: () => {
      handleClose()
      successModalRef.current?.(true)
      const newDate = new Date().toISOString()
      queryClient.setQueryData(['api-token'], (oldData: ApiTokenItem[]) => [
        {
          created_at: newDate,
          last_used_at: null,
          name: description,
          permission: null,
          workspace_id: null,
          updated_at: newDate,
        },
        ...oldData,
      ])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['api-token'] })
    },
  })

  const hasErrorAfterSubmit = (error as AxiosError<PostApiTokenErrorResponse>)?.response?.data?.detail
  const hasErrorBeforeSubmitted = !!hasErrorAfterSubmit || !description || forbiddenNames.includes(description)
  const hasError = (submitted && hasErrorBeforeSubmitted) || !!hasErrorAfterSubmit

  const onSubmit = (e: FormEvent<HTMLDivElement> | ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setSubmitted(true)
    if (!hasErrorBeforeSubmitted) {
      mutate({ name: description, permission: null, workspace_id: null })
    }
  }

  const handleReset = () => {
    setDescription('')
    setSubmitted(false)
  }

  const handleClose = () => {
    handleReset()
    setOpen(false)
    onClose?.()
  }

  const handleCloseSuccess = () => {
    reset()
    successModalRef.current?.(false)
  }

  return (
    <>
      <Button startIcon={<AddIcon />} variant={mode === 'dark' ? 'outlined' : 'contained'} onClick={() => setOpen(true)}>
        <Trans>Create new API token</Trans>
      </Button>
      <Modal
        openRef={successModalRef}
        onClose={handleCloseSuccess}
        title={<Trans>Important</Trans>}
        actions={
          <Button variant="outlined" onClick={handleCloseSuccess}>
            <Trans>Close</Trans>
          </Button>
        }
        slotProps={{ backdrop: { sx: { bgcolor: alpha('#000000', 0.6) } } }}
      >
        <Typography component={Stack}>
          <Box mb={2}>
            <Trans>
              Copy and securely store this token immediately.
              <br />
              You will not be able to view the token again after you navigate away from this page.
            </Trans>
          </Box>
          <Box>
            <Trans>Token</Trans>:
            {isSuccess && data ? (
              <SecretField secret={data.token} numberOfCharacter={68} slotProps={{ containerStack: { mt: 1 } }} />
            ) : (
              <Skeleton variant="rounded" width="100%" />
            )}
          </Box>
        </Typography>
      </Modal>
      <RightSlider
        open={open}
        component="form"
        onClose={handleClose}
        title={<Trans>Create new API Token</Trans>}
        onSubmit={onSubmit}
        spacing={3}
        height="100%"
      >
        <Stack flex={1} p={3}>
          <TextField
            label={t`Description`}
            error={hasError}
            fullWidth
            size="small"
            helperText={
              hasError
                ? (hasErrorAfterSubmit ?? description)
                  ? t`There's already another api tokens with the same description`
                  : t`Please enter a brief description`
                : undefined
            }
            name="create-new-api-token-description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </Stack>
        <Divider />
        <Stack direction="row" pb={3} px={3} spacing={2} justifyContent="end">
          {isPending ? null : (
            <Button variant="outlined" onClick={handleClose}>
              <Trans>Cancel</Trans>
            </Button>
          )}
          {isSuccess && data?.token ? null : (
            <LoadingButton
              loadingPosition={isPending ? 'start' : undefined}
              startIcon={<AddIcon />}
              loading={isPending}
              variant="contained"
              disabled={hasError}
              onClick={onSubmit}
            >
              <Trans>Create</Trans>
            </LoadingButton>
          )}
        </Stack>
      </RightSlider>
    </>
  )
}
