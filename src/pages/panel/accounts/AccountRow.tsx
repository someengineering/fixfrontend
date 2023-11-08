import { Trans, t } from '@lingui/macro'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import DoDistorbIcon from '@mui/icons-material/DoDisturb'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Button, Checkbox, CircularProgress, IconButton, Stack, TableCell, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { Modal } from 'src/shared/modal'
import { Account, GetWorkspaceCloudAccountsResponse } from 'src/shared/types/server'
import { deleteAccountMutation } from './deleteAccount.mutation'
import { disableAccountMutation } from './disableAccount.mutation'
import { enableAccountMutation } from './enableAccount.mutation'
import { renameAccountMutation } from './renameAccount.mutation'
import { replaceRowByAccount } from './replaceRowByAccount'

export const AccountRow = ({ account }: { account: Account }) => {
  const inputRef = useRef<HTMLInputElement>()
  const showModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()
  const { mutate: renameAccount, isPending: renameAccountIsPending } = useMutation({
    mutationFn: renameAccountMutation,
    mutationKey: ['edit-workspace-account', selectedWorkspace?.id, account.id],
  })
  const { mutate: disableAccount, isPending: disableAccountIsPending } = useMutation({
    mutationFn: disableAccountMutation,
    mutationKey: ['edit-workspace-account', selectedWorkspace?.id, account.id],
  })
  const { mutate: enableAccount, isPending: enableAccountIsPending } = useMutation({
    mutationFn: enableAccountMutation,
    mutationKey: ['edit-workspace-account', selectedWorkspace?.id, account.id],
  })
  const { mutate: deleteAccount, isPending: deleteAccountIsPending } = useMutation({
    mutationFn: deleteAccountMutation,
    mutationKey: ['edit-workspace-account', selectedWorkspace?.id, account.id],
  })
  const [isEdit, setIsEdit] = useState(false)
  const [editedName, setEditedName] = useState(account.name)
  const cancelEdit = useCallback(() => {
    setIsEdit(false)
    setEditedName(account.name)
  }, [account.name])
  useEffect(() => {
    if (isEdit && inputRef.current) {
      const cancelMethod = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelEdit()
        }
      }
      const currentRef = inputRef.current
      currentRef.addEventListener('keydown', cancelMethod)
      return () => {
        currentRef.removeEventListener('keydown', cancelMethod)
      }
    }
  }, [isEdit, cancelEdit])
  const oneHourLater = new Date()
  oneHourLater.setHours(oneHourLater.getHours() + 1)
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedWorkspace?.id) {
      renameAccount(
        { name: editedName || null, workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: replaceRowByAccount(queryClient, selectedWorkspace?.id),
          onSettled: () => setIsEdit(false),
        },
      )
    }
  }
  const handleEnableChange = (_: unknown, checked: boolean) => {
    if (selectedWorkspace?.id) {
      return (checked ? enableAccount : disableAccount)(
        { workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: replaceRowByAccount(queryClient, selectedWorkspace?.id),
        },
      )
    }
  }
  const handleDeleteModal = () => {
    if (showModalRef.current) {
      showModalRef.current()
    }
  }
  const handleDelete = () => {
    if (selectedWorkspace?.id) {
      deleteAccount(
        { workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-cloud-accounts', selectedWorkspace?.id], (oldData: GetWorkspaceCloudAccountsResponse) => {
              const foundIndex = oldData.findIndex((item) => item.id === account.id)
              if (foundIndex > -1) {
                const newData = [...oldData]
                newData.splice(foundIndex, 1)
                return newData
              }
              return oldData
            })
          },
        },
      )
    }
  }
  return (
    <TableRow>
      <TableCell>
        <CloudAvatar cloud={account.cloud} />
      </TableCell>
      <TableCell>{account.account_id}</TableCell>
      <TableCell>
        {isEdit ? (
          <Stack
            component="form"
            name={`rename-for-${account.account_id}`}
            onSubmit={handleEditSubmit}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <TextField
              sx={{ flexGrow: 1 }}
              defaultValue={account.name}
              onChange={(e) => setEditedName(e.target.value)}
              variant="standard"
              fullWidth
              autoFocus
              margin="none"
              inputProps={{ style: { padding: '0' } }}
              inputRef={inputRef}
              disabled={renameAccountIsPending}
            />
            {renameAccountIsPending ? (
              <CircularProgress size={20} />
            ) : editedName !== account.name ? (
              <Tooltip title={<Trans>Submit</Trans>}>
                <IconButton aria-label={t`Submit`} color="success" type="submit">
                  <SendIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton aria-label={t`Submit`} disabled type="submit">
                <SendIcon />
              </IconButton>
            )}
            {renameAccountIsPending ? (
              <IconButton disabled aria-label={t`Cancel`}>
                <CancelIcon />
              </IconButton>
            ) : (
              <Tooltip title={<Trans>Cancel</Trans>}>
                <IconButton aria-label={t`Cancel`} color="error" onClick={cancelEdit}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography flexGrow={1} onClick={() => setIsEdit(true)} sx={{ cursor: 'pointer' }}>
              {account.name ?? '-'}
            </Typography>
            <Tooltip title={<Trans>Edit</Trans>}>
              <IconButton aria-label={t`Edit`} color="primary" onClick={() => setIsEdit(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
      <TableCell>{account.is_configured ? <CheckIcon color="success" /> : <DoDistorbIcon color="error" />}</TableCell>
      <TableCell>{account.resources ?? '-'}</TableCell>
      <TableCell>{account.next_scan ? new Date(account.next_scan).toLocaleTimeString() : '-'}</TableCell>
      <TableCell>
        {enableAccountIsPending || disableAccountIsPending ? (
          <Stack justifyContent="center" direction="column" padding={1} margin="1px">
            <CircularProgress size={20} />
          </Stack>
        ) : (
          <Checkbox
            name={`enable-account-${account.account_id}`}
            disabled={!account.is_configured}
            checked={account.enabled}
            onChange={handleEnableChange}
          />
        )}
      </TableCell>
      <TableCell>
        {deleteAccountIsPending ? (
          <IconButton aria-label={t`Delete`} disabled>
            <DeleteIcon />
          </IconButton>
        ) : (
          <Tooltip title={<Trans>Delete</Trans>}>
            <IconButton aria-label={t`Delete`} color="error" onClick={handleDeleteModal}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <Modal
        title={<Trans>Are you sure?</Trans>}
        description={<Trans>Do you want to delete this account?</Trans>}
        openRef={showModalRef}
        actions={
          <>
            {deleteAccountIsPending ? null : (
              <Button color="primary" variant="contained" onClick={() => showModalRef.current?.(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <LoadingButton
              loadingPosition={deleteAccountIsPending ? 'start' : undefined}
              startIcon={<DeleteIcon />}
              loading={deleteAccountIsPending}
              color="error"
              variant="outlined"
              onClick={handleDelete}
            >
              <Trans>Delete</Trans>
            </LoadingButton>
          </>
        }
      >
        <Typography>
          <Trans>ID</Trans>: {account.account_id}
        </Typography>
        <Typography>
          <Trans>Cloud</Trans>: {account.cloud.toUpperCase()}
        </Typography>
        <Typography>
          <Trans>Name</Trans>: {account.name}
        </Typography>
      </Modal>
    </TableRow>
  )
}
