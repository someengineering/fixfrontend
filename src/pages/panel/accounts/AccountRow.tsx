import { Trans, plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingButton } from '@mui/lab'
import {
  Badge,
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
import { AxiosError } from 'axios'
import { FormEvent, ReactNode, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CancelIcon, DeleteIcon, EditFilledIcon, SendFilledIcon, WarningIcon } from 'src/assets/icons'
import { useUserProfile } from 'src/core/auth'
import { CloudAvatar } from 'src/shared/cloud-avatar'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { InternalLinkButton } from 'src/shared/link-button'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { Modal } from 'src/shared/modal'
import { useNonce } from 'src/shared/providers'
import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { Account } from 'src/shared/types/server-shared'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { getAccountName } from 'src/shared/utils/getAccountName'
import { diffDateTimeToDuration, iso8601DurationToString } from 'src/shared/utils/parseDuration'
import { AccountErrorLog } from './AccountErrorLog'
import { deleteAccountMutation } from './deleteAccount.mutation'
import { patchAccountMutation } from './patchAccount.mutation'
import { patchAccountDisableMutation } from './patchAccountDisable.mutation'
import { patchAccountEnableMutation } from './patchAccountEnable.mutation'
import { patchAccountScanDisableMutation } from './patchAccountScanDisable.mutation'
import { patchAccountScanEnableMutation } from './patchAccountScanEnable.mutation'
import { replaceRowByAccount } from './replaceRowByAccount'

const getDateStr = (date?: string | null, locale?: Intl.LocalesArgument) => {
  if (!date) {
    return [undefined, undefined] as const
  }

  const nextScanDate = new Date(date)
  if (Number.isNaN(nextScanDate.valueOf())) {
    return [undefined, undefined] as const
  }
  const nextScanDateStr = nextScanDate.toLocaleDateString(locale)
  const nextScanStr = `${new Date().toLocaleDateString(locale) === nextScanDateStr ? '' : `${nextScanDateStr} `}${nextScanDate?.toLocaleTimeString(locale)}`
  const nextScanDurStr = iso8601DurationToString(diffDateTimeToDuration(new Date(), nextScanDate), 1).toLocaleLowerCase()
  return [nextScanStr, nextScanDurStr] as const
}

interface AccountRowProps {
  account: Account
  enableErrorModalContent?: ReactNode
  isNotConfigured?: boolean
  canEnable?: boolean
}
export const AccountRow = ({ account, enableErrorModalContent, isNotConfigured, canEnable }: AccountRowProps) => {
  const inputRef = useRef<HTMLInputElement>()
  const {
    i18n: { locale },
  } = useLingui()
  const showCannotEnableModalRef = useRef<(show?: boolean) => void>()
  const showDeleteModalRef = useRef<(show?: boolean) => void>()
  const showDegradedModalRef = useRef<(show?: boolean) => void>()
  const showErrorModalRef = useRef<(show?: boolean) => void>()
  const { selectedWorkspace, checkPermission } = useUserProfile()
  const hasPermission = checkPermission('updateCloudAccounts')
  const queryClient = useQueryClient()
  const nonce = useNonce()

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
            queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-account'),
            })
            replaceRowByAccount(queryClient, data, selectedWorkspace?.id)
          },
          onSettled: () => setIsEdit(false),
        },
      )
    }
  }

  const handleEnableChange = (_: unknown, checked: boolean) => {
    if (canEnable || !checked) {
      if (selectedWorkspace?.id) {
        return (checked ? enableAccount : disableAccount)(
          { workspaceId: selectedWorkspace.id, id: account.id },
          {
            onSuccess: (data) => {
              queryClient.invalidateQueries({
                predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-account'),
              })
              replaceRowByAccount(queryClient, data, selectedWorkspace?.id)
            },
            onError: (err) => {
              if ((err as AxiosError)?.status === 403) {
                showCannotEnableModalRef.current?.(true)
              }
            },
          },
        )
      }
    } else {
      showCannotEnableModalRef.current?.(true)
    }
  }

  const handleEnableScanChange = (_: unknown, checked: boolean) => {
    if (selectedWorkspace?.id) {
      return (checked ? enableScanAccount : disableScanAccount)(
        { workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-account'),
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
            queryClient.invalidateQueries({
              predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('workspace-cloud-account'),
            })
          },
          onError: () => {
            queryClient.invalidateQueries({
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
  const [nextScanStr, nextScanDurStr] =
    !account.is_configured || !account.enabled || account.state === 'degraded'
      ? [undefined, undefined]
      : getDateStr(account.next_scan, locale)
  const [lastScanStr, lastScanDurStr] = getDateStr(account.last_scan_finished_at, locale)
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
        {isEdit && hasPermission ? (
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
              inputProps={{ nonce, style: { padding: '0' } }}
              inputRef={inputRef}
              disabled={renameAccountIsPending}
            />
            {renameAccountIsPending ? (
              <CircularProgress size={20} />
            ) : editedName !== accountName ? (
              <Tooltip title={<Trans>Submit</Trans>} arrow>
                <IconButton aria-label={t`Submit`} color="success" type="submit">
                  <SendFilledIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton aria-label={t`Submit`} disabled type="submit">
                <SendFilledIcon />
              </IconButton>
            )}
            {renameAccountIsPending ? (
              <IconButton disabled aria-label={t`Cancel`}>
                <CancelIcon />
              </IconButton>
            ) : (
              <Tooltip title={<Trans>Cancel</Trans>} arrow>
                <IconButton aria-label={t`Cancel`} color="error" onClick={cancelEdit}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : hasPermission ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography flexGrow={1} onClick={() => setIsEdit(true)} sx={{ cursor: 'pointer' }}>
              {accountName ?? '-'}
            </Typography>
            <Tooltip title={<Trans>Edit</Trans>} arrow>
              <IconButton aria-label={t`Edit`} color="primary" onClick={() => setIsEdit(true)}>
                <EditFilledIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Typography>{accountName ?? '-'}</Typography>
        )}
      </TableCell>
      <TableCell>{account.resources ?? '-'}</TableCell>
      <TableCell>
        {lastScanStr ? (
          <Tooltip title={lastScanStr}>
            <Typography>
              <Trans>{lastScanDurStr} ago</Trans>
            </Typography>
          </Tooltip>
        ) : (
          '-'
        )}
      </TableCell>
      {isNotConfigured ? null : (
        <>
          <TableCell>
            {nextScanStr ? (
              <Tooltip title={nextScanStr}>
                <Typography>
                  <Trans>In {nextScanDurStr}</Trans>
                </Typography>
              </Tooltip>
            ) : (
              '-'
            )}
          </TableCell>
          {hasPermission ? (
            <>
              <TableCell>
                {enableAccountIsPending || disableAccountIsPending ? (
                  <Stack justifyContent="center" direction="column" padding={1} margin="1px">
                    <CircularProgress size={20} />
                  </Stack>
                ) : (
                  <Checkbox name={`enable-account-${account.account_id}`} checked={account.enabled} onChange={handleEnableChange} />
                )}
              </TableCell>
              <TableCell>
                {enableScanAccountIsPending || disableScanAccountIsPending ? (
                  <Stack justifyContent="center" direction="column" padding={1} margin="1px">
                    <CircularProgress size={20} />
                  </Stack>
                ) : (
                  <Checkbox name={`enable-account-${account.account_id}`} checked={account.scan} onChange={handleEnableScanChange} />
                )}
              </TableCell>
            </>
          ) : null}
        </>
      )}
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          {hasPermission ? (
            deleteAccountIsPending ? (
              <IconButton aria-label={t`Delete`} disabled>
                <DeleteIcon />
              </IconButton>
            ) : (
              <Tooltip title={<Trans>Delete</Trans>} arrow>
                <IconButton aria-label={t`Delete`} color="error" onClick={handleDeleteModal}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )
          ) : null}
          {account.errors ? (
            <Tooltip
              title={
                <Typography color="warning.main">
                  {plural(account.errors, { one: 'One error reported', two: 'Two errors reported', other: '# errors reported' })}
                </Typography>
              }
            >
              <Badge badgeContent={account.errors} color="warning">
                <ButtonBase onClick={() => showErrorModalRef.current?.(true)}>
                  <WarningIcon color="warning" />
                </ButtonBase>
              </Badge>
            </Tooltip>
          ) : null}
        </Stack>
      </TableCell>
      <Modal
        title={<Trans>Access to your account is broken</Trans>}
        width={550}
        openRef={showDegradedModalRef}
        actions={
          <Stack direction="row" spacing={1} justifyContent="space-between" width="100%">
            <Button variant="outlined" onClick={() => showDegradedModalRef.current?.(false)}>
              <Trans>Close</Trans>
            </Button>
            <InternalLinkButton
              variant="contained"
              to={`/accounts/setup-cloud/${account.cloud}`}
              onClick={() => showDegradedModalRef.current?.(false)}
            >
              {account.cloud === 'aws' ? (
                <Trans>Deploy Stack</Trans>
              ) : account.cloud === 'gcp' ? (
                <Trans>Connect GCP Service Account</Trans>
              ) : account.cloud === 'azure' ? (
                <Trans>Configure Service Principal</Trans>
              ) : (
                <Trans>Setup cloud</Trans>
              )}
            </InternalLinkButton>
          </Stack>
        }
      >
        <Typography>
          {account.cloud === 'aws' ? (
            <Trans>
              This account is currently in a degraded state.
              <br />
              Fix was unable to gather data from this account.
              <br />
              <br />
              To resume security scans, please log into the {accountName} account ({account.account_id}) and re-deploy the CloudFormation
              stack that establishes the IAM role trust.
            </Trans>
          ) : account.cloud === 'gcp' ? (
            <Trans>
              This project is currently in a degraded state.
              <br />
              Fix was unable to gather data from this project.
              <br />
              <br />
              To resume security scans, please ensure that the service account you configured is set up correctly.
              <br />
              You may also recreate and upload the service account definition.
            </Trans>
          ) : account.cloud === 'azure' ? (
            <Trans>
              This subscription is currently in a degraded state.
              <br />
              Fix was unable to gather data from this subscription.
              <br />
              <br />
              To resume security scans, please ensure that the application permissions are set up correctly.
              <br />
              You may also recreate and redefine the access credentials.
            </Trans>
          ) : (
            <Trans>
              This account is currently in a degraded state possibly due to a misconfiguration.
              <br />
              Fix was unable to gather data from this account.
            </Trans>
          )}
        </Typography>
      </Modal>
      <Modal
        openRef={showErrorModalRef}
        width={1000}
        title={<Trans>Errors reported during the last collect of account {accountName}</Trans>}
        actions={
          <Button color="primary" variant="contained" onClick={() => showErrorModalRef.current?.(false)}>
            <Trans>Ok</Trans>
          </Button>
        }
      >
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <AccountErrorLog accountId={account.id} />
          </Suspense>
        </NetworkErrorBoundary>
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
          <Trans>Cloud</Trans>: {getAccountCloudName(account.cloud)}
        </Typography>
        <Typography>
          <Trans>Name</Trans>: {accountName}
        </Typography>
      </Modal>
      <Modal
        title={<Trans>Cannot enable this account</Trans>}
        openRef={showCannotEnableModalRef}
        actions={
          <Button color="primary" variant="contained" onClick={() => showCannotEnableModalRef.current?.(false)}>
            <Trans>Ok</Trans>
          </Button>
        }
      >
        {enableErrorModalContent}
      </Modal>
    </TableRow>
  )
}
