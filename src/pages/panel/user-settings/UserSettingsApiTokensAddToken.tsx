import { t, Trans } from '@lingui/macro'
import AddIcon from '@mui/icons-material/Add'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useThemeMode } from 'src/core/theme'
import { Modal } from 'src/shared/modal'
import { ApiTokenItem } from 'src/shared/types/server'
import { postApiTokenMutation } from './postApiToken.mutation'

interface UserSettingsApiTokensAddTokenProps {
  forbiddenNames: string[]
}

export const UserSettingsApiTokensAddToken = ({ forbiddenNames }: UserSettingsApiTokensAddTokenProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [description, setDescription] = useState('')
  const { mode } = useThemeMode()

  const modalRef = useRef<(show?: boolean | undefined) => void>()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: postApiTokenMutation,
    onSettled: () => {
      modalRef.current?.(false)
      setDescription('')
      setSubmitted(false)
      void queryClient.invalidateQueries({ queryKey: ['api-token'] })
    },
  })

  const hasErrorBeforeSubmitted = !description || forbiddenNames.includes(description)
  const hasError = submitted && hasErrorBeforeSubmitted

  const onSubmit = () => {
    setSubmitted(true)
    if (!hasErrorBeforeSubmitted) {
      mutate(
        { name: description, permission: null, workspace_id: null },
        {
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
        },
      )
    }
  }

  return (
    <>
      <Button startIcon={<AddIcon />} variant={mode === 'dark' ? 'outlined' : 'contained'} onClick={() => modalRef.current?.(true)}>
        <Trans>Create new API token</Trans>
      </Button>
      <Modal
        onClose={() => {
          setDescription('')
          setSubmitted(false)
        }}
        openRef={modalRef}
        title={<Trans>Create new API Token</Trans>}
        onSubmit={onSubmit}
        actions={
          <>
            {isPending ? null : (
              <Button color="inherit" onClick={() => modalRef.current?.(false)}>
                <Trans>Close</Trans>
              </Button>
            )}
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
          </>
        }
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
          <TextField
            label={t`Description`}
            error={hasError}
            fullWidth
            size="small"
            helperText={
              hasError
                ? description
                  ? t`There's already another api tokens with the same description`
                  : t`Please enter a brief description`
                : undefined
            }
            name="create-new-api-token-description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </Stack>
      </Modal>
    </>
  )
}
