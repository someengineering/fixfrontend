import { t, Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useThemeMode } from 'src/core/theme'
import { Modal } from 'src/shared/modal'
import { SecretField } from 'src/shared/secret-field'
import { ApiTokenItem, PostApiTokenErrorResponse } from 'src/shared/types/server'
import { postApiTokenMutation } from './postApiToken.mutation'

interface UserSettingsApiTokensAddTokenProps {
  forbiddenNames: string[]
  onClose?: () => void
}

export const UserSettingsApiTokensAddToken = ({ forbiddenNames, onClose }: UserSettingsApiTokensAddTokenProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [description, setDescription] = useState('')
  const { mode } = useThemeMode()

  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const queryClient = useQueryClient()
  const { mutate, isPending, data, isSuccess, error, reset } = useMutation({
    mutationFn: postApiTokenMutation,
    onSuccess: () => {
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
      void queryClient.invalidateQueries({ queryKey: ['api-token'] })
    },
  })

  const hasErrorAfterSubmit = (error as AxiosError<PostApiTokenErrorResponse>)?.response?.data?.detail
  const hasErrorBeforeSubmitted = !!hasErrorAfterSubmit || !description || forbiddenNames.includes(description)
  const hasError = (submitted && hasErrorBeforeSubmitted) || !!hasErrorAfterSubmit

  const onSubmit = () => {
    setSubmitted(true)
    if (!hasErrorBeforeSubmitted) {
      mutate({ name: description, permission: null, workspace_id: null })
    }
  }

  const handleReset = () => {
    setDescription('')
    setSubmitted(false)
    reset()
  }

  const handleClose = () => {
    handleReset()
    modalRef.current?.(false)
    onClose?.()
  }

  return (
    <>
      <Button startIcon={<AddIcon />} variant={mode === 'dark' ? 'outlined' : 'contained'} onClick={() => modalRef.current?.(true)}>
        <Trans>Create new API token</Trans>
      </Button>
      <Modal
        onClose={handleReset}
        openRef={modalRef}
        title={<Trans>Create new API Token</Trans>}
        onSubmit={onSubmit}
        actions={
          <>
            {isPending ? null : (
              <Button color="inherit" onClick={handleClose}>
                <Trans>Close</Trans>
              </Button>
            )}
            {isSuccess && data?.token ? null : (
              <LoadingButton
                loadingPosition={isPending ? 'start' : undefined}
                startIcon={<AddIcon />}
                loading={isPending}
                color="success"
                variant="outlined"
                disabled={hasError}
                onClick={onSubmit}
              >
                <Trans>Create</Trans>
              </LoadingButton>
            )}
          </>
        }
      >
        {isSuccess && data?.token ? (
          <Typography component={Stack}>
            <Box mb={2}>
              <Trans>
                <b>Important</b>: Copy and securely store this token immediately.
                <br />
                You will not be able to view the token again after you navigate away from this page.
              </Trans>
            </Box>
            <Box>
              <Trans>Token</Trans>: <SecretField secret={data.token} numberOfCharacter={68} slotProps={{ containerStack: { mt: 1 } }} />
            </Box>
          </Typography>
        ) : (
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
        )}
      </Modal>
    </>
  )
}
