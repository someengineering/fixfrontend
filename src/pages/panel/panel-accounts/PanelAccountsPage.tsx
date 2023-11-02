import { Trans, t } from '@lingui/macro'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared-queries/getWorkspaceCloudAccounts.query'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { Modal } from 'src/shared/modal'
import { Account, GetWorkspaceCloudAccountsResponse, GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'
import { getInitiated } from 'src/shared/utils/localstorage'
import { deleteAccountMutation } from './deleteAccount.mutation'
import { disableAccountMutation } from './disableAccount.mutation'
import { enableAccountMutation } from './enableAccount.mutation'
import { renameAccountMutation } from './renameAccount.mutation'

const ReplaceRowByAccount = (queryClient: QueryClient, id?: string) => {
  return (data: Account) => {
    if (data) {
      queryClient.setQueryData(['workspace-cloud-accounts', id], (oldData: GetWorkspaceCloudAccountsResponse) => {
        const foundIndex = oldData.findIndex((item) => item.id === data.id)
        if (foundIndex > -1) {
          const newData = [...oldData]
          newData[foundIndex] = data
          return newData
        }
        return oldData
      })
      queryClient.setQueryData(['workspace-report-summary', id], (oldData: GetWorkspaceInventoryReportSummaryResponse) => {
        const foundIndex = oldData.accounts.findIndex((item) => item.id === data.account_id)
        if (foundIndex > -1) {
          const newData = { ...oldData }
          newData.accounts = [...oldData.accounts]
          newData.accounts[foundIndex] = {
            ...oldData.accounts[foundIndex],
            name: data.name,
          }
          return newData
        }
        return oldData
      })
    }
  }
}

const AccountRow = ({ account }: { account: Account }) => {
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
  useEffect(() => {
    if (isEdit && inputRef.current) {
      const cancelMethod = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsEdit(false)
        }
      }
      const currentRef = inputRef.current
      currentRef.addEventListener('keydown', cancelMethod)
      return () => {
        currentRef.removeEventListener('keydown', cancelMethod)
      }
    }
  }, [isEdit])
  const oneHourLater = new Date()
  oneHourLater.setHours(oneHourLater.getHours() + 1)
  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedWorkspace?.id && editedName) {
      renameAccount(
        { name: editedName, workspaceId: selectedWorkspace.id, id: account.id },
        {
          onSuccess: ReplaceRowByAccount(queryClient, selectedWorkspace?.id),
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
          onSuccess: ReplaceRowByAccount(queryClient, selectedWorkspace?.id),
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
      <TableCell>{account.cloud.toUpperCase()}</TableCell>
      <TableCell>{account.account_id}</TableCell>
      <TableCell>
        {isEdit ? (
          <Stack component="form" onSubmit={handleEditSubmit} direction="row" alignItems="center" spacing={1}>
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
            ) : editedName && editedName !== account.name ? (
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
                <IconButton aria-label={t`Cancel`} color="error" onClick={() => setIsEdit(false)}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography flexGrow={1} onClick={() => setIsEdit(true)}>
              {account.name}
            </Typography>
            <Tooltip title={<Trans>Edit</Trans>}>
              <IconButton aria-label={t`Edit`} color="primary" onClick={() => setIsEdit(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Checkbox disabled checked={account.is_configured} />
      </TableCell>
      <TableCell>{account.resources}</TableCell>
      <TableCell>{new Date(account.next_scan).toLocaleTimeString()}</TableCell>
      <TableCell>
        {enableAccountIsPending || disableAccountIsPending ? (
          <Stack justifyContent="center" direction="column" padding={1} margin="1px">
            <CircularProgress size={20} />
          </Stack>
        ) : (
          <Checkbox checked={account.enabled} onChange={handleEnableChange} />
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

const AccountsPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { selectedWorkspace } = useUserProfile()
  const { data } = useQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id],
    queryFn: getWorkspaceCloudAccountsQuery,
    enabled: !!selectedWorkspace?.id,
  })
  const navigate = useNavigate()

  const goToSetupCloudPage = useCallback(() => {
    navigate('/setup-cloud')
  }, [navigate])

  useEffect(() => {
    if (!data?.length && !getInitiated()) {
      goToSetupCloudPage()
    }
  }, [data?.length, goToSetupCloudPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return data && !data.length ? (
    <Stack display="flex" flexGrow={1} flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography variant="h3">
        <Trans>There's no account configured for this workspace.</Trans>
      </Typography>
      <Typography variant="h5">
        <Trans>
          Please go to{' '}
          <Button variant="text" onClick={goToSetupCloudPage}>
            Setup Accounts
          </Button>{' '}
          page to setup your account first
        </Trans>
      </Typography>
    </Stack>
  ) : (
    <Stack width="100%" direction="row" flexGrow={1} flexShrink={1} flexBasis={0} overflow="hidden">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ height: 'calc(100% - 52px)' }}>
          <Table stickyHeader aria-label={t`Accounts`}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans>Cloud</Trans>
                </TableCell>
                <TableCell>
                  <Trans>ID</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Name</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Configured</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Resources</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Next scan</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Enabled</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Actions</Trans>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((account) => <AccountRow account={account} key={account.id} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          height="52px"
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Stack>
  )
}

export default function PanelAccountsPage() {
  return (
    <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <Suspense fallback={<LoadingSuspenseFallback />}>
        <AccountsPage />
      </Suspense>
    </NetworkErrorBoundary>
  )
}
