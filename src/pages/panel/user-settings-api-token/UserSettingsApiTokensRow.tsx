import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingButton } from '@mui/lab'
import { Button, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { DeleteIcon } from 'src/assets/icons'
import { Modal } from 'src/shared/modal'
import { ApiTokenItem } from 'src/shared/types/server'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { deleteApiTokenMutation } from './deleteApiToken.mutation'

interface UserSettingsApiTokensRowProps {
  item: ApiTokenItem
}

export const UserSettingsApiTokensRow = ({ item }: UserSettingsApiTokensRowProps) => {
  const {
    i18n: { locale },
  } = useLingui()
  const deleteModalRef = useRef<(show?: boolean | undefined) => void>()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: deleteApiTokenMutation,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['api-token'] })
    },
  })
  const createdAt = new Date(item.created_at)
  const lastUsed = item.last_used_at
    ? t`${iso8601DurationToString(diffDateTimeToDuration(new Date(), new Date(item.last_used_at)), 1)} ago`
    : '-'
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{`${createdAt.toLocaleDateString(locale)} ${createdAt.toLocaleTimeString(locale)}`}</TableCell>
      <TableCell>{lastUsed}</TableCell>
      <TableCell>
        {isPending ? (
          <IconButton aria-label={t`Delete`} disabled>
            <DeleteIcon />
          </IconButton>
        ) : (
          <Tooltip title={<Trans>Delete</Trans>} arrow>
            <IconButton aria-label={t`Delete`} onClick={() => deleteModalRef.current?.(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <Modal
        title={<Trans>Are you sure?</Trans>}
        description={<Trans>Do you want to delete this API Token?</Trans>}
        openRef={deleteModalRef}
        actions={
          <>
            {isPending ? null : (
              <Button color="primary" variant="contained" onClick={() => deleteModalRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton
              loadingPosition={isPending ? 'start' : undefined}
              startIcon={<DeleteIcon />}
              loading={isPending}
              color="error"
              variant="outlined"
              onClick={() => {
                mutate(
                  { name: item.name, token: null },
                  {
                    onSuccess: () => {
                      queryClient.setQueryData(['api-token'], (oldData: ApiTokenItem[]) => {
                        const newData = [...oldData]
                        const index = oldData.findIndex((oldItem) => oldItem.name === item.name)
                        if (index > -1) {
                          newData.splice(index, 1)
                        }
                        return newData
                      })
                    },
                  },
                )
              }}
            >
              <Trans>Delete</Trans>
            </LoadingButton>
          </>
        }
      >
        <Typography>
          <Trans>Name</Trans>: {item.name}
        </Typography>
        <Typography>
          <Trans>Created At</Trans>: {createdAt.toLocaleDateString(locale)} {createdAt.toLocaleTimeString(locale)}
        </Typography>
        <Typography>
          <Trans>Last used</Trans>: {lastUsed}
        </Typography>
      </Modal>
    </TableRow>
  )
}
