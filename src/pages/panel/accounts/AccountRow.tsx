import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { Modal } from 'src/shared/modal'
import { Account, GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getAccountName } from 'src/shared/utils/getAccountName'
import { deleteAccountMutation } from './deleteAccount.mutation'
import { patchAccountMutation } from './patchAccount.mutation'
import { patchAccountDisableMutation } from './patchAccountDisable.mutation'
import { patchAccountEnableMutation } from './patchAccountEnable.mutation'
import { patchAccountScanDisableMutation } from './patchAccountScanDisable.mutation'
import { patchAccountScanEnableMutation } from './patchAccountScanEnable.mutation'
import { replaceRowByAccount } from './replaceRowByAccount'

export const AccountRow = ({ account }: { account: Account }) => {
  const inputRef = useRef<HTMLInputElement>()
  const {
    i18n: { locale },
  } = useLingui()
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const showDegradedModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace } = useUserProfile()
  const queryClient = useQueryClient()

  const { mutate: renameAccount, isPending: renameAccountIsPending } = useMutation({
    mutationFn: patchAccountMutation,
  })

  const { mutate: disableAccount, isPending: disableAccountIsPending } = useMutation({
    mutationFn: patchAccountDisableMutation,
  })

  const { mutate: enableAccount, isPending: enableAccountIsPending } = useMutation({
    mutationFn: patchAccountEnableMutation,
  })

  const { mutate: disableScanAccount, isPending: disableScanAccountIsPending } = useMutation({
    mutationFn: patchAccountScanDisableMutation,
  })

  const { mutate: enableScanAccount, isPending: enableScanAccountIsPending } = useMutation({
    mutationFn: patchAccountScanEnableMutation,
  })

  const { mutate: deleteAccount, isPending: deleteAccountIsPending } = useMutation({
    mutationFn: deleteAccountMutation,
  })

  const [isEdit, setIsEdit] = useState(false)

  const accountName = getAccountName(account)
  const [editedName, setEditedName] = useState(accountName)

  const cancelEdit = useCallback(() => {
    setIsEdit(false)
    setEditedName(accountName)
  }, [accountName])

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

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedWorkspace?.id) {
      renameAccount(
        { name: editedName || null, workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: (data) => {
            void queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
            })
            replaceRowByAccount(queryClient, data, selectedWorkspace?.id)
          },
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
          onSuccess: (data) => {
            void queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
            })
            replaceRowByAccount(queryClient, data, selectedWorkspace?.id)
          },
        },
      )
    }
  }

  const handleEnableScanChange = (_: unknown, checked: boolean) => {
    if (selectedWorkspace?.id) {
      return (checked ? enableScanAccount : disableScanAccount)(
        { workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: (data) => {
            void queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
            })
            replaceRowByAccount(queryClient, data, selectedWorkspace?.id)
          },
        },
      )
    }
  }

  const handleDeleteModal = () => {
    if (showDeleteModalRef.current) {
      showDeleteModalRef.current()
    }
  }

  const handleDegradeModal = () => {
    if (showDegradedModalRef.current) {
      showDegradedModalRef.current()
    }
  }

  const handleDelete = () => {
    if (selectedWorkspace?.id) {
      deleteAccount(
        { workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(['workspace-cloud-accounts', selectedWorkspace?.id], (oldData: Account[]) => {
              const foundIndex = oldData.findIndex((item) => item.id === account.id)
              if (foundIndex > -1) {
                const newData = [...oldData]
                newData.splice(foundIndex, 1)
                return newData
              }
              return oldData
            })
            queryClient.setQueryData(
              ['workspace-inventory-report-summary', selectedWorkspace?.id],
              (oldData: GetWorkspaceInventoryReportSummaryResponse) => {
                const newData = { ...oldData }
                const foundIndex = newData.accounts.findIndex((item) => item.id === account.account_id)
                if (foundIndex > -1) {
                  newData.accounts = newData.accounts.filter((item) => item.id !== account.account_id)
                  newData.benchmarks = newData.benchmarks.map((benchmark) => {
                    benchmark.account_summary = { ...benchmark.account_summary }
                    delete benchmark.account_summary[account.account_id]
                    return benchmark
                  })
                  newData.changed_compliant = {
                    ...newData.changed_compliant,
                    accounts_selection: newData.changed_compliant.accounts_selection.filter((item) => item !== account.account_id),
                  }
                  newData.changed_vulnerable = {
                    ...newData.changed_vulnerable,
                    accounts_selection: newData.changed_vulnerable.accounts_selection.filter((item) => item !== account.account_id),
                  }
                  return newData
                }
                return oldData
              },
            )
            void queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-accounts'),
            })
          },
          onError: () => {
            void queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace'),
            })
          },
          onSettled: () => {
            showDeleteModalRef.current?.(false)
          },
        },
      )
    }
  }

  return (
    <TableRow>
      <TableCell>
        {account.privileged || account.state === 'degraded' ? (
          <CloudAvatar
            cloud={account.cloud}
            withCrown={account.privileged}
            tooltip={account.privileged ? <Trans>Privileged account</Trans> : null}
            onErrorClick={handleDegradeModal}
            error={
              account.state === 'degraded' ? (
                <Typography component={ButtonBase} onClick={handleDegradeModal}>
                  <Trans>Access to your account is broken</Trans>
                </Typography>
              ) : null
            }
          />
        ) : (
          <CloudAvatar cloud={account.cloud} />
        )}
      </TableCell>
      <TableCell>{account.account_id}</TableCell>
      <TableCell sx={{ minWidth: 230 }}>
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
              defaultValue={accountName === account.user_account_name ? accountName : ''}
              placeholder={account.api_account_name || account.api_account_alias || ''}
              onChange={(e) => setEditedName(e.target.value)}
              variant="standard"
              autoFocus
              margin="none"
              inputProps={{ style: { padding: '0' } }}
              inputRef={inputRef}
              disabled={renameAccountIsPending}
            />
            {renameAccountIsPending ? (
              <CircularProgress size={20} />
            ) : editedName !== accountName ? (
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
              {accountName ?? '-'}
            </Typography>
            <Tooltip title={<Trans>Edit</Trans>}>
              <IconButton aria-label={t`Edit`} color="primary" onClick={() => setIsEdit(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
      <TableCell>{account.resources ?? '-'}</TableCell>
      <TableCell>{account.next_scan ? new Date(account.next_scan).toLocaleTimeString(locale) : '-'}</TableCell>
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
        {enableScanAccountIsPending || disableScanAccountIsPending ? (
          <Stack justifyContent="center" direction="column" padding={1} margin="1px">
            <CircularProgress size={20} />
          </Stack>
        ) : (
          <Checkbox
            name={`enable-account-${account.account_id}`}
            disabled={!account.is_configured}
            checked={account.scan}
            onChange={handleEnableScanChange}
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
        title={<Trans>Access to your account is broken</Trans>}
        width={550}
        openRef={showDegradedModalRef}
        actions={
          <Button variant="outlined" component={Link} to="/workspace-settings/accounts/setup-cloud">
            <Trans>Deploy Stack</Trans>
          </Button>
        }
      >
        <Typography>
          <Trans>
            This account is currently in a degraded state possibly due to a misconfiguration. Fix was unable to access the account. To
            resume security scans, please log into account {accountName} ({account.account_id}) and re-deploy the CloudFormation stack that
            establishes the IAM role trust.
          </Trans>
        </Typography>
      </Modal>
      <Modal
        title={<Trans>Are you sure?</Trans>}
        description={
          <>
            <Trans>Do you want to delete this account?</Trans>
            {account.privileged ? (
              <Typography color="warning.main" width="100%" marginY={2} fontWeight="bold">
                <Trans>
                  Note: You are about to delete a management or delegated admin account. Please be aware that once deleted, we will no
                  longer have the capability to retrieve any account names, requiring you to edit them manually.
                </Trans>
              </Typography>
            ) : null}
          </>
        }
        openRef={showDeleteModalRef}
        actions={
          <>
            {deleteAccountIsPending ? null : (
              <Button color="primary" variant="contained" onClick={() => showDeleteModalRef.current?.(false)}>
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
          <Trans>Name</Trans>: {accountName}
        </Typography>
      </Modal>
    </TableRow>
  )
}
